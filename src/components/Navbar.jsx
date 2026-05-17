'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const nav = [
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 border-b'
          : 'py-5 border-b border-transparent'
      }`}
      style={{
        background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-sm font-bold tracking-tight">CS Society</span>
          <span className="text-muted text-xs hidden sm:inline">IIUI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="text-xs font-medium text-muted hover:text-white transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          aria-label="Menu"
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1"
          onClick={() => setOpen(v => !v)}
        >
          <span className={`w-5 h-px bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`w-5 h-px bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-[2px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t px-5 py-6" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="block py-3 text-sm font-medium text-muted hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}