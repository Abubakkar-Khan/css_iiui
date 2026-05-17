// src/app/team/page.jsx
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function TeamPage() {
  const [mode, setMode] = useState('grid')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
    <div className="section pt-12 pb-24">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="max-w-xl">
          <span className="label">The Organizers</span>
          <h1 className="section-title mt-2">Core Team</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            The Computer Science Society is run by a dedicated team of students 
            committed to building a world-class tech community at IIUI.
          </p>
        </div>
        {!isMobile && (
          <div className="flex bg-surface border border-border">
            <button 
              onClick={() => setMode('grid')}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors ${mode === 'grid' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
            >
              Grid View
            </button>
            <button 
              onClick={() => setMode('tree')}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors ${mode === 'tree' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
            >
              Tree View
            </button>
          </div>
        )}
      </div>

      <div className="mt-16">
        {showTree ? <TreeCanvas root={data} /> : <GridFromTree root={data} />}
      </div>
    </div>
  )
}

function GridFromTree({ root }) {
  const list = []
  ;(function walk(n) { list.push(n); (n.children || []).forEach(walk) })(root)

  return (
    <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.map(p => (
        <article key={p.id} className="card p-0 group overflow-hidden">
          <div className="overflow-hidden aspect-square">
            <img
              src={p.img}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <span className="label text-[10px]">{p.role}</span>
            <h3 className="mt-1 text-base font-bold text-white">{p.name}</h3>
          </div>
        </article>
      ))}
    </div>
  )
}

function TreeCanvas({ root }) {
  const NODE_W = 200
  const NODE_H = 240
  const X_GAP  = 60
  const Y_GAP  = 120

  const { nodes, edges } = useTreeLayout(root, NODE_W, NODE_H, X_GAP, Y_GAP)

  return (
    <div className="relative w-full h-[70vh] border border-border bg-[#0d0d0d] overflow-hidden">
      <PanZoom initial={{ scale: 0.8 }}>
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
                  stroke="#333"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </g>
        </svg>

        <div className="absolute" style={{ left: 2000, top: 80, width: 1, height: 1 }}>
          {nodes.map(n => (
            <div
              key={n.id}
              className="absolute card p-0 overflow-hidden bg-surface"
              style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
            >
              <img
                src={n.img}
                alt={n.name}
                className="w-full h-[65%] object-cover"
              />
              <div className="p-3">
                <span className="label text-[9px]">{n.role}</span>
                <div className="text-sm font-bold text-white mt-0.5">{n.name}</div>
              </div>
            </div>
          ))}
        </div>
      </PanZoom>
    </div>
  )
}

function PanZoom({ initial = { scale: 1 }, children }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(initial.scale || 1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    setPos({ x: wrap.clientWidth / 2 - 2000 * scale, y: 40 })
  }, [])

  const onWheel = (e) => {
    e.preventDefault()
    const delta = -e.deltaY
    const zoomIntensity = 0.001
    const newScale = Math.max(0.3, Math.min(2, scale * (1 + delta * zoomIntensity)))
    const rect = wrapRef.current.getBoundingClientRect()
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top
    const px = (cx - pos.x) / scale, py = (cy - pos.y) / scale
    setScale(newScale)
    setPos({ x: cx - px * newScale, y: cy - py * newScale })
  }

  const onPointerDown = (e) => { isPanning.current = true; last.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const onPointerMove = (e) => { if (!isPanning.current) return; setPos(p => ({ x: p.x + (e.clientX - last.current.x), y: p.y + (e.clientY - last.current.y) })); last.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e) => { isPanning.current = false; e.currentTarget.releasePointerCapture?.(e.pointerId) }

  return (
    <div ref={wrapRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div className="absolute" style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: '0 0', width: 4000, height: 3000 }}>
        {children}
      </div>
    </div>
  )
}

function useTreeLayout(root, NODE_W, NODE_H, X_GAP, Y_GAP) {
  return useMemo(() => {
    function measure(n) { if (!n.children || n.children.length === 0) { n._leaves = 1; return 1 } let sum = 0; for (const c of n.children) sum += measure(c); n._leaves = sum; return sum }
    const copy = structuredClone(root); measure(copy)
    const nodes = [], edges = []
    function assign(n, depth, startX) {
      const subtreeWidth = n._leaves * (NODE_W + X_GAP), xCenter = startX + subtreeWidth / 2 - (NODE_W + X_GAP) / 2, y = depth * (NODE_H + Y_GAP)
      nodes.push({ ...n, x: xCenter, y })
      let run = startX; for (const c of n.children || []) { assign(c, depth + 1, run); edges.push({ from: n.id, to: c.id }); run += c._leaves * (NODE_W + X_GAP) }
    }
    assign(copy, 0, 0)
    const xOffset = -(copy._leaves * (NODE_W + X_GAP)) / 2 + (NODE_W + X_GAP) / 2
    nodes.forEach(n => { n.x += xOffset })
    return { nodes, edges }
  }, [root, NODE_W, NODE_H, X_GAP, Y_GAP])
}
