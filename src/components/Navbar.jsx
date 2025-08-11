'use client'
import Link from 'next/link'
import { useState } from 'react'

const nav = [
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/compulink', label: 'CompuLink' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
]

export default function Navbar(){
  const [open,setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wider text-white">CSS Society</Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className="text-sm text-white/80 hover:text-white">{n.label}</Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button aria-label="Menu" className="btn-ghost" onClick={()=>setOpen(v=>!v)}>Menu</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/70">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
            {nav.map(n => (
              <Link key={n.href} href={n.href} className="text-sm text-white/80 hover:text-white" onClick={()=>setOpen(false)}>{n.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}