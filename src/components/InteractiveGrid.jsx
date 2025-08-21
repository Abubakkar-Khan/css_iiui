'use client'
import { useEffect, useRef } from 'react'

export default function InteractiveGrid(){
  const ref = useRef(null)
  const mouse = useRef({ x:-9999, y:-9999 })
  const smooth = useRef({ x:-9999, y:-9999 })
  const ripples = useRef([])
  const points = useRef([])
  const raf = useRef(0)
  const last = useRef(0)

  useEffect(()=>{
    const c = ref.current
    const ctx = c.getContext('2d')

    // dots shift
    const offsetY = 5   // move dots down by 5px

    // --- tuning ---
    const baseR = 1.05
    const magR = 140
    const magS = 14
    const smoothing = 0.22
    const rippleSpeed = 240
    const rippleWidthFactor = 0.45
    const sizeBoost = 1.2
    const lightBoost = 20

    const spacingFor = (w)=> w < 640 ? 22 : w < 1024 ? 28 : 32

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let dprUsed = dpr
    let spacing = spacingFor(innerWidth)
    let fpsDebt = 0

    const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const getTheme = () => {
      const cs = getComputedStyle(document.documentElement)
      const H = parseFloat(cs.getPropertyValue('--grid-h')) || 208
      const S = parseFloat(cs.getPropertyValue('--grid-s')) || 10
      return { H, S }
    }
    let { H, S } = getTheme()
    const colorOf = (L)=> `hsl(${H} ${S}% ${L}%)`

    const build = ()=>{
      const w = innerWidth, h = innerHeight
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      dprUsed = Math.min(dprUsed, dpr)
      spacing = spacingFor(w)

      c.width = Math.floor(w * dprUsed)
      c.height = Math.floor(h * dprUsed)
      c.style.width = w + 'px'
      c.style.height = h + 'px'
      ctx.setTransform(dprUsed, 0, 0, dprUsed, 0, 0)

      const arr = []
      for(let x=0;x<=w;x+=spacing) for(let y=0;y<=h;y+=spacing) arr.push({ x, y })
      points.current = arr
    }

    const resize = ()=>{ build(); ({H,S} = getTheme()) }
    build(); addEventListener('resize', resize)

    const move = e => {
      mouse.current = { x:e.clientX, y:e.clientY }
      if (smooth.current.x === -9999) smooth.current = { x:e.clientX, y:e.clientY }
    }
    const leave = ()=>{ mouse.current = { x:-9999, y:-9999 } }
    const click = e => {
      ripples.current.push({ x:e.clientX, y:e.clientY, r:0, max:220, a:1, w:spacing * rippleWidthFactor })
    }
    addEventListener('mousemove', move, { passive:true })
    addEventListener('mouseleave', leave, { passive:true })
    addEventListener('click', click, { passive:true })

    if (prefersReduce) {
      const w = c.width / dprUsed, h = c.height / dprUsed
      ctx.clearRect(0,0,w,h)
      for (let i=0;i<points.current.length;i++){
        const p = points.current[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y + offsetY, baseR, 0, Math.PI*2) // shifted down
        ctx.fillStyle = colorOf(78)
        ctx.fill()
      }
      return ()=>{ removeEventListener('resize', resize); removeEventListener('mousemove', move); removeEventListener('mouseleave', leave); removeEventListener('click', click) }
    }

    const tick = (now = performance.now())=>{
      const dt = Math.min(0.05, (now - (last.current || now)) / 1000) || 0.016
      last.current = now

      const fps = 1/dt
      if (fps < 45) fpsDebt = Math.min(90, fpsDebt + 1)
      else if (fps > 58) fpsDebt = Math.max(0, fpsDebt - 1)
      if (fpsDebt > 60) {
        if (spacing < spacingFor(innerWidth) + 6) { spacing += 2; build() }
        if (dprUsed > 1.5) { dprUsed = 1.5; build() }
        fpsDebt = 30
      }

      smooth.current.x += (mouse.current.x - smooth.current.x) * smoothing
      smooth.current.y += (mouse.current.y - smooth.current.y) * smoothing

      const w = c.width / dprUsed, h = c.height / dprUsed
      ctx.clearRect(0,0,w,h)

      const mx = smooth.current.x, my = smooth.current.y

      for (let i=0;i<points.current.length;i++){
        const px = points.current[i].x
        const py = points.current[i].y + offsetY // dots moved down

        const dx = mx - px, dy = my - py
        const dist = Math.hypot(dx, dy)

        let ox = 0, oy = 0
        let r = baseR
        let L = 78

        if (dist < magR){
          const f = (magR - dist) / magR
          const inv = 1 / (dist || 1)
          ox += dx * inv * f * magS
          oy += dy * inv * f * magS
          r = baseR + f * sizeBoost
          L = 78 + f * lightBoost
        }

        for (let j=0;j<ripples.current.length;j++){
          const rp = ripples.current[j]
          const rx = px - rp.x, ry = py - rp.y
          const rd = Math.hypot(rx, ry)
          const band = 1 - Math.min(1, Math.abs(rd - rp.r) / (spacing * rippleWidthFactor))
          if (band > 0){
            const f = band * (1 - rp.r / rp.max)
            const inv = 1 / (rd || 1)
            ox += rx * inv * f * 9
            oy += ry * inv * f * 9
          }
        }

        ctx.beginPath()
        ctx.arc(px + ox, py + oy, r, 0, Math.PI*2)
        ctx.fillStyle = colorOf(L)
        ctx.fill()
      }

      for (let i=0;i<ripples.current.length;i++){
        const rp = ripples.current[i]
        rp.r += rippleSpeed * dt
        rp.a -= 0.7 * dt
        if (rp.r > rp.max || rp.a <= 0){ ripples.current.splice(i,1); i-- }
      }

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)

    return ()=>{
      cancelAnimationFrame(raf.current)
      removeEventListener('resize', resize)
      removeEventListener('mousemove', move)
      removeEventListener('mouseleave', leave)
      removeEventListener('click', click)
    }
  },[])

  return (
    <canvas
      ref={ref}
      className="fixed inset-x-0 top-[5px] bottom-0 z-0 pointer-events-none opacity-50"
      aria-hidden
    />
  )
}
