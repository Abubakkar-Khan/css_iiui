// src/app/team/page.jsx
'use client'
import { useEffect, useState } from 'react'
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa6'

export default function TeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setMembers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="section-pad section">
      <div className="max-w-xl mx-auto text-center mb-16">
        <span className="label justify-center">The Society</span>
        <h1 className="section-title mt-2 text-white">Team Members</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          Meet the dedicated team of students running the Computer Science Society at IIUI. We work together to build workshops, developer sessions, and hackathons.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Loading Team Members...
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map(p => (
            <article key={p.id} className="card p-0 group overflow-hidden bg-[var(--surface)] border border-border hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="overflow-hidden aspect-square border-b border-border">
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400'}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <span className="label text-[10px] justify-center">{p.designation}</span>
                    <h3 className="mt-2 text-base font-bold text-white uppercase tracking-tight truncate">{p.name}</h3>
                    {p.details && (
                      <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2 font-medium">
                        {p.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social media connections */}
                {(p.linkedin || p.instagram || p.facebook) && (
                  <div className="flex justify-center gap-4 py-3.5 border-t border-border bg-[#0d0f14]/50">
                    {p.linkedin && (
                      <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="LinkedIn">
                        <FaLinkedinIn size={12} />
                      </a>
                    )}
                    {p.instagram && (
                      <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Instagram">
                        <FaInstagram size={12} />
                      </a>
                    )}
                    {p.facebook && (
                      <a href={p.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Facebook">
                        <FaFacebookF size={12} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
          {members.length === 0 && (
            <div className="col-span-full border border-border p-20 text-center text-sm text-muted bg-surface">
              No team members listed yet. Add them in the Admin Dashboard!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
