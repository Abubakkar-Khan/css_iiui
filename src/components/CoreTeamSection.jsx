'use client'
import { useEffect, useState } from 'react'
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa6'

const DEFAULT_MEMBERS = [
  { 
    name: 'Abdullah Haroon', 
    designation: 'President', 
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    details: 'Leading society operations, technical infrastructure, and building a world-class developer community.',
    linkedin: 'https://www.linkedin.com/company/computer-science-society-css/'
  },
  { 
    name: 'Junaid Khan', 
    designation: 'Vice President', 
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    details: 'Coordinating event operations and corporate partnerships.',
    linkedin: 'https://www.linkedin.com/company/computer-science-society-css/'
  },
  { 
    name: 'Ayesha Tariq', 
    designation: 'General Secretary', 
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    details: 'Managing external communications and team organization.',
    linkedin: 'https://www.linkedin.com/company/computer-science-society-css/'
  },
  { 
    name: 'Hamza Ali', 
    designation: 'Technical Lead', 
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    details: 'Designing dev curricula, bootcamps, and hackathon challenges.',
    linkedin: 'https://www.linkedin.com/company/computer-science-society-css/'
  },
  { 
    name: 'Fatima Noor', 
    designation: 'Operations Lead', 
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    details: 'Overseeing logistical execution and workshop operations.',
    linkedin: 'https://www.linkedin.com/company/computer-science-society-css/'
  },
  { 
    name: 'Usman Sheikh', 
    designation: 'Design Lead', 
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    details: 'Directing all brand visuals and user interface designs.',
    linkedin: 'https://www.linkedin.com/company/computer-science-society-css/'
  },
]

export default function CoreTeamSection() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setMembers(data)
        } else {
          setMembers(DEFAULT_MEMBERS)
        }
        setLoading(false)
      })
      .catch(() => {
        setMembers(DEFAULT_MEMBERS)
        setLoading(false)
      })
  }, [])

  return (
    <section id="team" className="section pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="section-header text-center mb-12">
        <span className="label justify-center">Roster Cabinet</span>
        <h2 className="section-title mt-4">Team Members</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Syncing team roster...
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((m, idx) => (
            <article key={m.id || idx} className="card p-0 group overflow-hidden bg-[var(--surface)] border border-border hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="overflow-hidden relative aspect-square border-b border-border">
                    <img
                      src={m.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400'}
                      alt={m.name}
                      className="w-full h-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 bg-surface text-center">
                    <span className="text-[8px] font-mono uppercase text-muted tracking-wider block mb-1">
                      {m.designation}
                    </span>
                    <h3 className="text-xs font-black text-white uppercase tracking-tight truncate">
                      {m.name}
                    </h3>
                    {m.details && (
                      <p className="mt-2 text-[10px] text-muted leading-relaxed line-clamp-2 font-medium">
                        {m.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shared Social Icons */}
                {(m.linkedin || m.instagram || m.facebook) && (
                  <div className="flex justify-center gap-4 py-3 border-t border-border bg-[#0d0f14]/50">
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="LinkedIn">
                        <FaLinkedinIn size={12} />
                      </a>
                    )}
                    {m.instagram && (
                      <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Instagram">
                        <FaInstagram size={12} />
                      </a>
                    )}
                    {m.facebook && (
                      <a href={m.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Facebook">
                        <FaFacebookF size={12} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}