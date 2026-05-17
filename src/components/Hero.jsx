'use client'
import { useEffect, useState } from 'react'

const slides = [
  {
    title: 'Initialize\nCS Society',
    body: 'Building the next generation of engineers through research, development, and community collaboration.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
    tag: 'Operational',
  },
  {
    title: 'Execute\nWorkshops',
    body: 'Technical training sessions covering cloud architecture, distributed systems, and modern AI pipelines.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
    tag: 'Education',
  },
  {
    title: 'Deploy\nHackathons',
    body: 'High-intensity building sessions. Solve complex problems under tight constraints. Win or learn.',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
    tag: 'Production',
  },
]

export default function Hero() {
  const [idx, setIdx] = useState(0)

  const go = (dir) => setIdx(v => (v + dir + slides.length) % slides.length)

  useEffect(() => {
    const timer = setInterval(() => go(1), 10000)
    return () => clearInterval(timer)
  }, [])

  const s = slides[idx]

  return (
    <section className="section mt-4 md:mt-8">
      <div className="relative group overflow-hidden border border-border bg-black">
        {/* Navigation Buttons - Left & Right */}
        <button 
          onClick={() => go(-1)}
          className="slider-nav left-4 opacity-0 group-hover:opacity-100"
          aria-label="Prev"
        >
          ‹
        </button>
        <button 
          onClick={() => go(1)}
          className="slider-nav right-4 opacity-0 group-hover:opacity-100"
          aria-label="Next"
        >
          ›
        </button>

        {/* Image */}
        <div className="relative h-[65vh] md:h-[80vh] overflow-hidden">
          {slides.map((slide, i) => (
            <img
              key={i}
              src={slide.img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
              style={{ 
                opacity: i === idx ? 0.6 : 0,
                transform: i === idx ? 'scale(1)' : 'scale(1.1)',
                filter: 'contrast(1.1) brightness(0.8)'
              }}
            />
          ))}
          
          {/* Technical Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute top-6 right-6 font-mono text-[9px] text-muted tracking-tighter opacity-40 text-right leading-none">
            COORD_SYS: WGS84<br />
            FRAGMENT_ID: {idx.toString().padStart(3, '0')}<br />
            STATUS: ACTIVE
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 pointer-events-none">
          <div className="pointer-events-auto max-w-2xl">
            <span className="label">{s.tag}</span>

            <h1 className="mt-4 text-4xl md:text-7xl font-black leading-none tracking-tighter whitespace-pre-line uppercase">
              {s.title}
            </h1>

            <p className="mt-6 text-sm md:text-base text-muted max-w-lg leading-relaxed font-medium">
              {s.body}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/events" className="btn">Initialize</a>
              <a href="/about" className="btn-ghost">View Manifest</a>
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-12 flex gap-3 pointer-events-auto">
            {slides.map((_, k) => (
              <button
                key={k}
                onClick={() => setIdx(k)}
                className="h-1 transition-all duration-500 bg-white"
                style={{
                  width: k === idx ? 40 : 8,
                  opacity: k === idx ? 1 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
