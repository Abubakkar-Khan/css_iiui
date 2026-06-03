// src/components/Hero.jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { optimizeImageUrl } from '@/lib/images'

export default function Hero({ initialNews = [] }) {
  const formatNews = (data) => {
    if (data && data.length > 0) {
      return data.slice(0, 5).map((item) => ({
        id: item.id,
        title: item.title,
        body: item.details,
        img: item.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
        tag: new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' }),
      }))
    }
    return []
  }

  const [slides, setSlides] = useState(() => formatNews(initialNews))
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(initialNews.length === 0)

  const go = (dir) => setIdx(v => (v + dir + slides.length) % slides.length)

  useEffect(() => {
    if (initialNews.length > 0) return
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setSlides(formatNews(data))
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [initialNews])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => go(1), 8000)
    return () => clearInterval(timer)
  }, [slides])

  if (loading) {
    return (
      <section className="section mt-4 md:mt-8">
        <div className="relative h-[65vh] md:h-[80vh] border border-border bg-surface flex items-center justify-center">
          <div className="text-xs font-mono text-muted uppercase animate-pulse">Loading updates...</div>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    // Fast, simple, and legible static welcome hero (No mock data fallback)
    return (
      <section className="section mt-4 md:mt-8">
        <div className="relative border border-border bg-surface p-12 md:p-24 flex flex-col justify-center min-h-[50vh] md:min-h-[60vh]">
          <span className="label w-max">Welcome to CSS IIUI</span>
          <h1 className="mt-6 text-4xl md:text-7xl font-black tracking-tighter uppercase text-white leading-none">
            Empowering CS Students <br className="hidden md:inline" /> at IIUI
          </h1>
          <p className="mt-6 text-base md:text-xl text-muted max-w-2xl leading-relaxed font-medium">
            Welcome to the Computer Science Society. We build a strong developer community through practical learning, events, and industry collaboration.
          </p>
          <div className="mt-8">
            <Link href="/events" className="btn text-sm px-10 py-4">
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const s = slides[idx]

  return (
    <section className="section mt-4 md:mt-8">
      <div className="relative group overflow-hidden border border-border bg-surface">
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
            <Image
              key={i}
              src={optimizeImageUrl(slide.img, 1200)}
              alt="Slide backdrop"
              fill
              priority={i === 0}
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
              style={{ 
                opacity: i === idx ? 0.6 : 0,
                transform: i === idx ? 'scale(1)' : 'scale(1.05)',
                filter: 'contrast(1.02) brightness(0.65)'
              }}
            />
          ))}
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 pointer-events-none">
          <div 
            key={idx}
            className="pointer-events-auto max-w-2xl animate-fade-in-up"
          >
            <span className="label">{s.tag}</span>

            <h1 className="mt-4 text-3xl md:text-6xl font-black leading-none tracking-tighter whitespace-pre-line uppercase text-zinc-100">
              {s.title}
            </h1>

            <p className="mt-6 text-sm md:text-lg text-muted max-w-lg leading-relaxed font-medium line-clamp-3">
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
