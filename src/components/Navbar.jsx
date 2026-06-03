'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import logoImg from '@/assets/css.png'

const nav = [
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 py-3.5 border-b"
      style={{
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group select-none">
          <Image
            src={logoImg}
            alt="The Computer Science Society Logo"
            width={200}
            height={60}
            priority
            className="object-contain transition-all duration-300 invert group-hover:scale-[1.03] h-9 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-semibold text-muted hover:text-white transition-colors"
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