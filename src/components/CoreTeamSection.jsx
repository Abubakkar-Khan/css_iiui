'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa6'

const getDesignationPriority = (designation) => {
  const desc = (designation || '').toLowerCase();
  if (desc.includes('president') && !desc.includes('vice')) return 1;
  if (desc.includes('vice president') || desc.includes('vice-president')) return 2;
  if (desc.includes('secretary')) return 3;
  if (desc.includes('lead') && !desc.includes('co-') && !desc.includes('sub-') && !desc.includes('vice')) return 4;
  if (desc.includes('co-lead') || desc.includes('colead') || desc.includes('sub-lead') || desc.includes('sublead') || desc.includes('vice lead')) return 5;
  return 6;
};

export default function CoreTeamSection({ initialTeam = [] }) {
  const [president, setPresident] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(initialTeam.length === 0)

  const processTeam = (data) => {
    if (data && Array.isArray(data)) {
      const sortedData = [...data].sort((a, b) => {
        return getDesignationPriority(a.designation) - getDesignationPriority(b.designation);
      });

      const pres = sortedData.find(m => {
        const d = m.designation.toLowerCase();
        return d.includes('president') && !d.includes('vice');
      });

      const leadMembers = sortedData.filter(m => {
        const d = m.designation.toLowerCase();
        const isPres = pres && m.id === pres.id;
        const isLeadOrOfficer = d.includes('lead') || d.includes('vice president') || d.includes('vice-president') || d.includes('secretary');
        return isLeadOrOfficer && !isPres;
      });

      return { president: pres || null, leads: leadMembers };
    }
    return { president: null, leads: [] };
  }

  useEffect(() => {
    if (initialTeam.length > 0) {
      const { president: pres, leads: ld } = processTeam(initialTeam);
      setPresident(pres);
      setLeads(ld);
      setLoading(false);
      return;
    }

    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        const { president: pres, leads: ld } = processTeam(data);
        setPresident(pres);
        setLeads(ld);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [initialTeam]);

  const hasPeople = president || leads.length > 0

  return (
    <section id="team" className="section pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="section-header text-center mb-12">
        <span className="label justify-center">Society Leadership</span>
        <h2 className="section-title mt-4">Our Team</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Syncing team roster...
        </div>
      ) : !hasPeople ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase border border-border/50 bg-[var(--surface)]">
          No active cabinet members listed at the moment.
        </div>
      ) : (
        <>
          {/* President — featured prominently above the leads grid */}
          {president && (
            <div className="mb-12">
              <div className="card p-0 overflow-hidden bg-[var(--surface)] border border-border hover:border-white/20 transition-all duration-300 grid md:grid-cols-2 max-w-3xl mx-auto">
                <div className="overflow-hidden relative aspect-square border-b md:border-b-0 md:border-r border-border">
                  <img
                    src={president.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400'}
                    alt={president.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center bg-surface">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white bg-white/10 px-2.5 py-1 inline-block border border-white/10 rounded-none mb-3 w-max">
                    {president.designation}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                    {president.name}
                  </h3>
                  {president.details && (
                    <p className="mt-4 text-xs text-muted leading-relaxed">
                      {president.details}
                    </p>
                  )}
                  {/* Social Links */}
                  {(president.linkedin || president.instagram || president.facebook) && (
                    <div className="flex gap-4 mt-6">
                      {president.linkedin && (
                        <a href={president.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="LinkedIn">
                          <FaLinkedinIn size={14} />
                        </a>
                      )}
                      {president.instagram && (
                        <a href={president.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Instagram">
                          <FaInstagram size={14} />
                        </a>
                      )}
                      {president.facebook && (
                        <a href={president.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Facebook">
                          <FaFacebookF size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leads Grid */}
          {leads.length > 0 && (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {leads.map((m, idx) => (
                <MemberCard key={m.id || idx} member={m} />
              ))}
            </div>
          )}

          {/* View Full Team link */}
          <div className="text-center mt-10">
            <Link href="/team" className="btn-ghost">
              View Full Team →
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

function MemberCard({ member: m }) {
  return (
    <article className="card p-0 group overflow-hidden bg-[var(--surface)] border border-border hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full">
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
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white bg-white/10 px-2 py-0.5 inline-block border border-white/10 rounded-none mb-2">
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

        {/* Social Icons */}
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
  )
}