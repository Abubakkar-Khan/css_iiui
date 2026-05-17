// src/app/team/page.jsx
'use client'
import { useEffect, useState } from 'react'

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
      <div className="max-w-xl mb-16">
        <span className="label">The Society</span>
        <h1 className="section-title mt-2">Team Members</h1>
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
            <article key={p.id} className="card p-0 group overflow-hidden bg-black">
              <div className="overflow-hidden aspect-square">
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400'}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="label text-[10px]">{p.designation}</span>
                <h3 className="mt-1 text-base font-bold text-white">{p.name}</h3>
                {p.details && (
                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                    {p.details}
                  </p>
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
