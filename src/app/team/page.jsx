// src/app/team/page.jsx
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function TeamPage() {
  const [mode, setMode] = useState('grid') // 'grid' | 'tree'
  const [isMobile, setIsMobile] = useState(false)

  // Disable tree on mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ----- Sample hierarchical data (replace with real team) -----
  const data = useMemo(() => ({
    id: 'root',
    name: 'Abdullah Haroon',
    role: 'President',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    children: [
      {
        id: 'vpres',
        name: 'Junaid Khan',
        role: 'Vice President',
        img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop',
        children: [
          { id: 'ops1', name: 'Member 1', role: 'Ops', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop', children: [] },
          { id: 'ops2', name: 'Member 2', role: 'Ops', img: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop', children: [] },
          { id: 'ops3', name: 'Member 3', role: 'Ops', img: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=800&auto=format&fit=crop', children: [] },
        ],
      },
      {
        id: 'gensec',
        name: 'Ayesha Tariq',
        role: 'General Secretary',
        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        children: [
          { id: 'des1', name: 'Member 4', role: 'Design', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop', children: [] },
          { id: 'des2', name: 'Member 5', role: 'Design', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop', children: [] },
        ],
      },
      {
        id: 'techlead',
        name: 'Hamza Ali',
        role: 'Tech Lead',
        img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
        children: [
          { id: 'tech1', name: 'Member 6', role: 'Tech', img: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=800&auto=format&fit=crop', children: [] },
          { id: 'tech2', name: 'Member 7', role: 'Tech', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', children: [] },
          { id: 'tech3', name: 'Member 8', role: 'Tech', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop', children: [] },
          { id: 'tech4', name: 'Member 9', role: 'Tech', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop', children: [] },
        ],
      },
    ],
  }), [])

  const showTree = !isMobile && mode === 'tree'

  return (
    <div className="section pt-8 md:pt-10 pb-12 w-full relative">
      {/* Title a bit smaller & higher */}
      <h1 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight">Team</h1>

      {showTree ? <TreeCanvas root={data} /> : <GridFromTree root={data} />}

      {/* Floating bottom-right toggle (desktop only) */}
      <button
        onClick={() => setMode(m => (m === 'tree' ? 'grid' : 'tree'))}
        className="hidden md:inline-flex fixed bottom-6 right-6 z-[9999] bg-black/70 border border-white/15 text-white px-4 py-2 rounded-full shadow-xl backdrop-blur hover:bg-white/10 transition"
        title="Change Team View"
      >
        {showTree ? 'Grid View' : 'Tree View'}
      </button>
    </div>
  )
}

/* ------------------------------ GRID VIEW ------------------------------ */
function GridFromTree({ root }) {
  const list = []
  ;(function walk(n){ list.push(n); (n.children||[]).forEach(walk) })(root)

  return (
    <section className="mt-8">
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {list.map(p => (
          <article key={p.id} className="bg-black text-white border border-white/10">
            <div className="overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full aspect-[3/4] object-cover" />
            </div>
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">{p.role}</div>
              <h3 className="mt-1 text-base font-light">{p.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* --------------------------- TREE VIEW (PAN/ZOOM) --------------------------- */
function TreeCanvas({ root }) {
  // Equal card size
  const NODE_W = 220
  const NODE_H = 260
  const X_GAP  = 80
  const Y_GAP  = 160

  // Layout (centered around x=0)
  const { nodes, edges } = useTreeLayout(root, NODE_W, NODE_H, X_GAP, Y_GAP)

  return (
    <div className="mt-6 relative w-full h-[80vh] rounded-xl border border-white/10 overflow-hidden bg-black/50">
      <PanZoom initial={{ scale: 0.9 }}>
        {/* Connectors */}
        <svg width="4000" height="3000" className="absolute inset-0 pointer-events-none" style={{ left: 0, top: 0 }}>
          <g transform="translate(2000, 80)">
            {edges.map((e, i) => {
              const a = nodes.find(n => n.id === e.from)
              const b = nodes.find(n => n.id === e.to)
              const x1 = a.x + NODE_W / 2, y1 = a.y + NODE_H
              const x2 = b.x + NODE_W / 2, y2 = b.y
              const midY = (y1 + y2) / 2
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  shapeRendering="crispEdges"
                />
              )
            })}
          </g>
        </svg>

        {/* Nodes */}
        <div className="absolute" style={{ left: 2000, top: 80, width: 1, height: 1 }}>
          {nodes.map(n => (
            <div
              key={n.id}
              className="absolute border border-white/10 bg-black/60 text-white shadow"
              style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
            >
              <img src={n.img} alt={n.name} className="w-full h-[70%] object-cover" />
              <div className="p-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">{n.role}</div>
                <div className="text-lg font-light">{n.name}</div>
              </div>
            </div>
          ))}
        </div>
      </PanZoom>

      {/* subtle grid backdrop */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
    </div>
  )
}

/* --------------------------- PAN & ZOOM WRAPPER --------------------------- */
function PanZoom({ initial = { scale: 1 }, children }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(initial.scale || 1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  // Center initial content
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    setPos({ x: wrap.clientWidth / 2 - 2000 * scale, y: 40 }) // centers the 2000 offset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onWheel = (e) => {
    e.preventDefault()
    const delta = -e.deltaY
    const zoomIntensity = 0.0015
    const newScale = clamp(0.4, 2.2, scale * (1 + delta * zoomIntensity))

    // Zoom towards cursor
    const rect = wrapRef.current.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const px = (cx - pos.x) / scale
    const py = (cy - pos.y) / scale

    const nx = cx - px * newScale
    const ny = cy - py * newScale

    setScale(newScale)
    setPos({ x: nx, y: ny })
  }

  const onPointerDown = (e) => {
    isPanning.current = true
    last.current = { x: e.clientX, y: e.clientY }
    try { e.currentTarget.setPointerCapture?.(e.pointerId) } catch {}
  }
  const onPointerMove = (e) => {
    if (!isPanning.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setPos(p => ({ x: p.x + dx, y: p.y + dy }))
  }
  const onPointerUp = (e) => {
    isPanning.current = false
    try { e.currentTarget.releasePointerCapture?.(e.pointerId) } catch {}
  }

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: 4000,
          height: 3000,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ----------------------------- TREE LAYOUT ----------------------------- */
function useTreeLayout(root, NODE_W, NODE_H, X_GAP, Y_GAP) {
  return useMemo(() => {
    function measure(n) {
      if (!n.children || n.children.length === 0) { n._leaves = 1; return 1 }
      let sum = 0
      for (const c of n.children) sum += measure(c)
      n._leaves = sum
      return sum
    }
    const copy = structuredClone(root)
    measure(copy)

    const nodes = []
    const edges = []
    function assign(n, depth, startX) {
      const subtreeWidth = n._leaves * (NODE_W + X_GAP)
      const xCenter = startX + subtreeWidth / 2 - (NODE_W + X_GAP)/2
      const y = depth * (NODE_H + Y_GAP)
      nodes.push({ id: n.id, name: n.name, role: n.role, img: n.img, x: xCenter, y })
      let run = startX
      for (const c of n.children || []) {
        const cw = c._leaves * (NODE_W + X_GAP)
        assign(c, depth + 1, run)
        edges.push({ from: n.id, to: c.id })
        run += cw
      }
    }

    const width = copy._leaves * (NODE_W + X_GAP)
    assign(copy, 0, 0)

    // center around x=0
    const xOffset = -width / 2 + (NODE_W + X_GAP) / 2
    nodes.forEach(n => { n.x += xOffset })

    return { nodes, edges }
  }, [root, NODE_W, NODE_H, X_GAP, Y_GAP])
}

/* ------------------------------- Utils ------------------------------- */
function clamp(min, max, v) { return Math.max(min, Math.min(max, v)) }
