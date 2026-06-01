'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const DEFAULT_SLIDES = [
  {
    id: null,
    title: 'Empowering CS Students\nat IIUI',
    body: 'Welcome to the Computer Science Society. We build a strong developer community through practical learning, events, and industry collaboration.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
    tag: 'Welcome',
  },
]

export default function Hero() {
  const [slides, setSlides] = useState([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  const go = (dir) => setIdx(v => (v + dir + slides.length) % slides.length)

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title,
            body: item.details,
            img: item.imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
            tag: new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' }),
          }))
          setSlides(formatted)
        } else {
          setSlides(DEFAULT_SLIDES)
        }
        setLoading(false)
      })
      .catch(() => {
        setSlides(DEFAULT_SLIDES)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => go(1), 8000)
    return () => clearInterval(timer)
  }, [slides])

  if (loading || slides.length === 0) {
    return (
      <section className="section mt-4 md:mt-8">
        <div className="relative h-[65vh] md:h-[80vh] border border-border bg-surface flex items-center justify-center">
          <div className="text-xs font-mono text-muted uppercase animate-pulse">Loading updates...</div>
        </div>
      </section>
    )
  }

  const s = slides[idx]

  return (
    <section className="section mt-4 md:mt-8">
      <div className="relative group overflow-hidden border border-border bg-black">
        {/* Navigation Buttons - Left & Right */}
        {slides.length > 1 && (
          <>
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
          </>
        )}

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
                transform: i === idx ? 'scale(1)' : 'scale(1.05)',
                filter: 'contrast(1.05) brightness(0.7)'
              }}
            />
          ))}
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 pointer-events-none">
          <div 
            key={idx}
            className="pointer-events-auto max-w-2xl animate-fade-in-up"
          >
            <span className="label">{s.tag}</span>

            <h1 className="mt-4 text-3xl md:text-6xl font-black leading-none tracking-tighter whitespace-pre-line uppercase text-white">
              {s.title}
            </h1>

            <p className="mt-6 text-xs md:text-sm text-muted max-w-lg leading-relaxed font-medium line-clamp-3">
              {s.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {s.id ? (
                <Link href={`/news/${s.id}`} className="btn">Read More</Link>
              ) : (
                <Link href="/events" className="btn">Explore Events</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
