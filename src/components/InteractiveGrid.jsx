'use client'
import { useEffect, useRef } from 'react'

/**
 * Cellular Automata Background — B&W Conway's Game of Life
 * Large blocks, subtle white cells on black, mouse-reactive seeding.
 */
export default function InteractiveGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const mouse = { x: -1000, y: -1000 }

    const RES = 28 // wider blocks
    let cols, rows, grid, history, lastTick = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.ceil(canvas.width / RES) + 1
      rows = Math.ceil(canvas.height / RES) + 1
      grid = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => Math.random() > 0.82 ? 1 : 0)
      )
      history = Array.from({ length: cols }, () => new Array(rows).fill(0))
    }

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    const loop = (time) => {
      // Tick every 150ms — slow, organic feel
      if (time - lastTick > 150) {
        lastTick = time
        const next = Array.from({ length: cols }, () => new Array(rows).fill(0))

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const alive = grid[i][j]
            if (alive) history[i][j] = 1
            else history[i][j] *= 0.88 // slow decay

            let neighbors = 0
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue
                neighbors += grid[(i + dx + cols) % cols][(j + dy + rows) % rows]
              }
            }

            // Conway's rules
            if (alive && (neighbors === 2 || neighbors === 3)) next[i][j] = 1
            else if (!alive && neighbors === 3) next[i][j] = 1

            // Mouse proximity seeds new life
            const cx = i * RES + RES / 2
            const cy = j * RES + RES / 2
            const dist = Math.hypot(mouse.x - cx, mouse.y - cy)
            if (dist < 100 && Math.random() > 0.7) next[i][j] = 1
          }
        }
        grid = next
      }

      // Draw
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const h = history[i][j]
          if (h > 0.03) {
            const a = Math.round(h * 255 * 0.06) // very subtle, max ~6% white
            ctx.fillStyle = `rgba(255, 255, 255, ${a / 255})`
            ctx.fillRect(i * RES, j * RES, RES - 2, RES - 2)
          }
        }
      }

      requestAnimationFrame(loop)
    }

    const raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
