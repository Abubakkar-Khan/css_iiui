// src/app/team/page.jsx
'use client'
import { useMemo, useRef, useState, useEffect } from 'react'

export default function TeamPage() {
  // ✅ JS-friendly state (no TS generics)
  const [mode, setMode] = useState('grid') // 'grid' | 'canvas'

  // --- Sample data (replace with real) ---
  const leads = [
    { id: 'p1', name: 'Abdullah Haroon', role: 'President', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' },
    { id: 'p2', name: 'Junaid Khan', role: 'Vice President', img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop' },
    { id: 'p3', name: 'Ayesha Tariq', role: 'General Secretary', img: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop' },
  ]
  const members = Array.from({ length: 12 }).map((_, i) => ({
    id: `m${i + 1}`,
    name: `Member ${i + 1}`,
    role: ['Ops', 'Tech', 'Design', 'PR'][i % 4],
    img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
  }))

  // Tree levels for Canvas mode (top -> bottom)
  const treeLevels = useMemo(() => {
    return [
      leads.map(x => ({ ...x, level: 0 })),
      members.map(x => ({ ...x, level: 1 })),
    ]
  }, [leads, members])

  return (
    <div className="section py-12 md:py-16">
      {/* Centered & larger title */}
      <h1 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight">Team</h1>

      {/* Toggle buttons */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          className={`px-4 py-2 rounded-lg border border-white/15 ${mode === 'grid' ? 'bg-white text-black' : 'bg-black/40 text-white'} transition`}
          onClick={() => setMode('grid')}
          aria-pressed={mode === 'grid'}
        >
          Grid View
        </button>
        <button
          className={`px-4 py-2 rounded-lg border border-white/15 ${mode === 'canvas' ? 'bg-white text-black' : 'bg-black/40 text-white'} transition`}
          onClick={() => setMode('canvas')}
          aria-pressed={mode === 'canvas'}
        >
          Canvas (Figma-style)
        </button>
      </div>

      {mode === 'grid' ? (
        <BalenciagaGrid leads={leads} members={members} />
      ) : (
        <FigmaCanvas levels={treeLevels} />
      )}
    </div>
  )
}

/* =========================
   Balenciaga-style Grid
   ========================= */
function BalenciagaGrid({ leads, members }) {
  return (
    <>
      {/* Leads: tall, minimal cards */}
      <section className="mt-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-none bg-black text-white border border-white/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-[480px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-white/50">{p.role}</div>
                <h3 className="mt-2 text-2xl font-light">{p.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Members: tight, clean grid */}
      <section className="mt-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <article
              key={m.id}
              className="group relative overflow-hidden bg-black text-white border border-white/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-light">{m.name}</h4>
                <div className="text-xs uppercase tracking-widest text-white/50">{m.role}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

/* ======================================
   Figma-style Pan/Zoom Tree Canvas
   ====================================== */
function FigmaCanvas({ levels }) {
  // layout config
  const colGap = 280   // horizontal spacing
  const rowGap = 260   // vertical spacing
  const nodeW = 220
  const nodeH = 300

  // compute positions for each level (center rows)
  const nodes = useMemo(() => {
    const out = []
    levels.forEach((levelNodes, levelIdx) => {
      const totalW = (levelNodes.length - 1) * colGap
      const startX = -totalW / 2
      const y = levelIdx * rowGap
      levelNodes.forEach((n, i) => {
        out.push({ ...n, x: startX + i * colGap, y })
      })
    })
    return out
  }, [levels, colGap, rowGap])

  const byId = useMemo(() => {
    const map = new Map()
    nodes.forEach(n => map.set(n.id, n))
    return map
  }, [nodes])

  // demo edges: every top (level 0) -> every next (level 1)
  const edges = useMemo(() => {
    if (levels.length < 2) return []
    const top = levels[0].map(n => byId.get(n.id)).filter(Boolean)
    const bottom = levels[1].map(n => byId.get(n.id)).filter(Boolean)
    const e = []
    for (const a of top) for (const b of bottom) e.push({ from: a, to: b })
    return e
  }, [levels, byId])

  return (
    <div className="mt-8 relative h-[70vh] w-full rounded-xl border border-white/10 overflow-hidden bg-black/50">
      <PanZoom>
        {/* edges */}
        <svg className="absolute inset-0" width="4000" height="4000" style={{ pointerEvents: 'none' }}>
          <g transform="translate(2000, 2000)">
            {edges.map((e, i) => (
              <path
                key={i}
                d={bezierPath(e.from.x, e.from.y + nodeH / 2, e.to.x, e.to.y - nodeH / 2)}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
            ))}
          </g>
        </svg>

        {/* nodes */}
        <div className="absolute inset-0" style={{ width: 4000, height: 4000 }}>
          <div className="absolute" style={{ left: 2000, top: 2000 }}>
            {nodes.map(n => (
              <CardNode key={n.id} node={n} w={nodeW} h={nodeH} />
            ))}
          </div>
        </div>
      </PanZoom>
    </div>
  )
}

function CardNode({ node, w, h }) {
  return (
    <div
      className="group absolute border border-white/10 bg-black/60 text-white"
      style={{
        left: node.x - w / 2,
        top: node.y - h / 2,
        width: w,
        height: h,
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      }}
    >
      <div className="overflow-hidden">
        <img
          src={node.img}
          alt={node.name}
          className="w-full h-[70%] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">{node.role}</div>
        <div className="text-lg font-light">{node.name}</div>
      </div>
    </div>
  )
}

/* ==========================
   Pan & Zoom (Figma-like)
   ========================== */
function PanZoom({ children }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  // Center initial view once mounted
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    setPos({
      x: -2000 + wrap.clientWidth / 2,
      y: -2000 + wrap.clientHeight / 2,
    })
  }, [])

  const onWheel = (e) => {
    e.preventDefault()
    const delta = -e.deltaY
    const zoomIntensity = 0.0015
    const newScale = clamp(0.4, 2.2, scale * (1 + delta * zoomIntensity))

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
    // pointer capture is optional; guard it
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
      className="relative h-full w-full cursor-grab active:cursor-grabbing"
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
          height: 4000,
        }}
      >
        {children}
      </div>
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}

/* ==============
   Utils
   ============== */
function clamp(min, max, v) { return Math.max(min, Math.min(max, v)) }
function bezierPath(x1, y1, x2, y2) {
  const midY = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
}
