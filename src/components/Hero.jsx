'use client'
import { useEffect, useState } from 'react'

const slides = [
  {
    title: 'Random CSS Event NEWS 101',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
    date: 'Aug 16, 2024',
  },
  {
    title: 'Workshop Highlights',
    body: 'Sed tincidunt erat at nunc ultricies, vitae auctor massa condimentum.',
    img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop',
    date: 'Sep 2, 2024',
  },
]

const DURATION = 700 // ms

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const [prev, setPrev] = useState(0)
  const [dir, setDir] = useState(1) // 1=next, -1=prev
  const [phase, setPhase] = useState('idle') // 'idle' | 'enter'
  const [play, setPlay] = useState(false)

  const go = (d) => {
    setPrev(idx)
    setDir(d)
    setIdx((v) => (v + d + slides.length) % slides.length)
    setPhase('enter')
    setPlay(false)
  }

  // kick the transition after the new slide mounts
  useEffect(() => {
    if (phase !== 'enter') return
    const raf = requestAnimationFrame(() => setPlay(true))
    const t = setTimeout(() => setPhase('idle'), DURATION)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [phase])

  // keyboard + autoplay
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = reduce ? null : setInterval(() => go(1), 7000)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (timer) clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const s = slides[idx]
  const p = slides[prev]

  // helpers for transforms
  const currX = phase === 'enter' ? (play ? '0%' : `${dir * 100}%`) : '0%'
  const prevX = phase === 'enter' ? (play ? `${-dir * 100}%` : '0%') : '0%'
  const currScale = phase === 'enter' && play ? 1 : 1.02
  const prevScale = phase === 'enter' && play ? 1.02 : 1

  return (
    <section className="section mt-6" id="hero">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow">
        {/* Stage */}
        <div className="relative h-[42vh] md:h-[56vh]">
          {/* previous slide */}
          <img
            key={`prev-${prev}`}
            src={p.img}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{
              transform: `translateX(${prevX}) scale(${prevScale})`,
              transition: `transform ${DURATION}ms cubic-bezier(.22,.61,.36,1)`,
              filter: 'brightness(0.95)',
            }}
          />
          {/* current slide */}
          <img
            key={`curr-${idx}`}
            src={s.img}
            alt="slide"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{
              transform: `translateX(${currX}) scale(${currScale})`,
              transition: `transform ${DURATION}ms cubic-bezier(.22,.61,.36,1)`,
              filter: 'brightness(0.98)',
            }}
          />
        </div>

        {/* legibility gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* content */}
        <div className="absolute left-6 right-6 bottom-6 flex flex-col gap-2">
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-white/75">{s.date}</p>
          <h1 className="text-2xl md:text-4xl font-extrabold max-w-3xl leading-tight">{s.title}</h1>
          <p className="max-w-2xl text-white/85 hidden sm:block">{s.body}</p>
          <div className="mt-3">
            <a
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90 transition"
              href="/events"
            >
              READ MORE
            </a>
          </div>
        </div>

        {/* nav buttons — theme: dark glass + white icon, clear focus ring */}
        <button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="group absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 min-w-[48px] min-h-[48px] rounded-full bg-black/70 backdrop-blur border border-white/20 text-white hover:border-white/40 hover:bg-black/80 transition shadow-lg flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          {/* chevron svg for crispness */}
          <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform group-active:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          aria-label="Next slide"
          onClick={() => go(1)}
          className="group absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 min-w-[48px] min-h-[48px] rounded-full bg-black/70 backdrop-blur border border-white/20 text-white hover:border-white/40 hover:bg-black/80 transition shadow-lg flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform group-active:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        {/* dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, k) => (
            <span
              key={k}
              className={`h-1.5 w-4 rounded-full transition-all ${k === idx ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
