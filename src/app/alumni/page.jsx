// src/app/alumni/page.jsx
'use client'
import { useEffect, useState } from 'react'
import { FaLinkedinIn } from 'react-icons/fa6'

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/alumni')
      .then(res => res.json())
      .then(data => {
        // Sort by priority (ascending, so lower numbers or higher numbers go first)
        const sorted = data.sort((a, b) => (a.priority || 0) - (b.priority || 0));
        setAlumni(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="section-pad section">
      <div className="max-w-2xl mb-16">
        <span className="label">Alumni Network</span>
        <h1 className="section-title mt-4 font-black leading-tight uppercase">
          Graduates Directory
        </h1>
        <p className="mt-2 text-white/70 font-semibold text-lg md:text-xl tracking-tight">
          Connect, learn, and grow with our alumni network in tech.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Loading Alumni Network...
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {alumni.map((person) => (
            <article
              key={person.id}
              className="card p-4 flex flex-col group border-white/5 hover:border-white/20 transition-all duration-300 bg-black"
            >
              <div className="relative overflow-hidden aspect-square border border-white/10 mb-4 bg-black">
                <img
                  src={person.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'}
                  alt={person.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="label text-[9px] mb-2">[ {person.gradYear ? `F${person.gradYear.slice(-2) - 4}` : 'CSS'} ] • Class of {person.gradYear}</span>
                  <h3 className="text-md font-black uppercase tracking-tight text-white transition-colors">
                    {person.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed font-medium">
                    {person.role} {person.company && <><span className="text-white/30">@</span> {person.company}</>}
                  </p>
                </div>

                {person.linkedin && (
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors"
                    >
                      <FaLinkedinIn className="text-xs" aria-hidden="true" />
                      Connect Profile
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
          {alumni.length === 0 && (
            <div className="col-span-full border border-border p-20 text-center text-sm text-muted bg-surface">
              No alumni profiles listed yet. Add them in the Admin Dashboard!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
