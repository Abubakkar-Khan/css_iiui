'use client'
import { useEffect, useRef } from 'react'
export default function InteractiveGrid(){
  const ref = useRef(null)
  const mouse = useRef({ x:-9999, y:-9999 })
  const ripples = useRef([])
  useEffect(()=>{
    const c = ref.current, ctx = c.getContext('2d')
    const spacing=36, baseR=1.2, magR=160, magS=18
    const resize=()=>{ c.width=innerWidth; c.height=innerHeight }
    resize(); addEventListener('resize',resize)
    const move=e=>{ mouse.current={x:e.clientX,y:e.clientY} }
    const leave=()=>{ mouse.current={x:-9999,y:-9999} }
    const click=e=>{ ripples.current.push({x:e.clientX,y:e.clientY,r:0,max:260,a:1}) }
    addEventListener('mousemove',move); addEventListener('mouseleave',leave); addEventListener('click',click)
    const tick=()=>{
      const w=c.width,h=c.height; ctx.clearRect(0,0,w,h)
      for(let x=0;x<w;x+=spacing){ for(let y=0;y<h;y+=spacing){
        const dx=mouse.current.x-x, dy=mouse.current.y-y, dist=Math.hypot(dx,dy)
        let ox=0, oy=0, r=baseR, bright=210
        if(dist<magR){ const f=(magR-dist)/magR, ux=dx/(dist||1), uy=dy/(dist||1); ox+=ux*f*magS; oy+=uy*f*magS; r=baseR+f*2.6; bright=220+f*35 }
        for(const rp of ripples.current){ const rx=x-rp.x, ry=y-rp.y, rd=Math.hypot(rx,ry); if(Math.abs(rd-rp.r)<spacing/2){ const f=1-rp.r/rp.max, ux=rx/(rd||1), uy=ry/(rd||1); ox+=ux*f*14; oy+=uy*f*14 } }
        ctx.beginPath(); ctx.arc(x+ox,y+oy,r,0,Math.PI*2); ctx.fillStyle=`rgb(${bright},${bright},${bright})`; ctx.fill()
      }}
      for(let i=0;i<ripples.current.length;i++){ const rp=ripples.current[i]; rp.r+=3.6; rp.a-=0.012; if(rp.r>rp.max||rp.a<=0){ ripples.current.splice(i,1); i-- } }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return ()=>{ removeEventListener('resize',resize); removeEventListener('mousemove',move); removeEventListener('mouseleave',leave); removeEventListener('click',click) }
  },[])
  return <canvas ref={ref} className="fixed inset-x-0 top-30 bottom-0 z-0 pointer-events-none opacity-50" aria-hidden />
}