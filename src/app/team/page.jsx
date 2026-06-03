// src/app/team/page.jsx
'use client'
import { useEffect, useState } from 'react'
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa6'
import TeamCard from '@/components/TeamCard'

const getDesignationPriority = (designation) => {
  const desc = (designation || '').toLowerCase();
  if (desc.includes('president') && !desc.includes('vice')) return 1;
  if (desc.includes('vice president') || desc.includes('vice-president')) return 2;
  if (desc.includes('secretary')) return 3;
  if (desc.includes('lead') && !desc.includes('co-') && !desc.includes('sub-') && !desc.includes('vice')) return 4;
  if (desc.includes('co-lead') || desc.includes('colead') || desc.includes('sub-lead') || desc.includes('sublead') || desc.includes('vice lead')) return 5;
  return 6;
};

export default function TeamPage() {
  const [president, setPresident] = useState(null)
  const [leads, setLeads] = useState([])
  const [others, setOthers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          // Sort all data by designation priority first
          const sortedData = [...data].sort((a, b) => {
            return getDesignationPriority(a.designation) - getDesignationPriority(b.designation);
          });

          // Find the president (designation contains "president" and not "vice")
          const pres = sortedData.find(m => {
            const d = m.designation.toLowerCase();
            return d.includes('president') && !d.includes('vice');
          });
          setPresident(pres || null)

          // Filter leads (designation contains "lead" or high ranking roles), excluding the president
          const leadMembers = sortedData.filter(m => {
            const d = m.designation.toLowerCase();
            const isPres = pres && m.id === pres.id;
            const isLeadOrOfficer = d.includes('lead') || d.includes('vice president') || d.includes('vice-president') || d.includes('secretary');
            return isLeadOrOfficer && !isPres;
          });
          setLeads(leadMembers)

          // Filter others (normal members, not leads and not president)
          const rest = sortedData.filter(m => {
            const d = m.designation.toLowerCase();
            const isPres = pres && m.id === pres.id;
            const isLeadOrOfficer = d.includes('lead') || d.includes('vice president') || d.includes('vice-president') || d.includes('secretary');
            return !isPres && !isLeadOrOfficer;
          });
          setOthers(rest)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="section-pad section">
      <div className="max-w-xl mx-auto text-center mb-16">
        <span className="label justify-center">The Society</span>
        <h1 className="section-title mt-2 text-white">Team Members</h1>
        <p className="mt-4 text-muted text-base leading-relaxed">
          Meet the dedicated team of students running the Computer Science Society at IIUI. We work together to build workshops, developer sessions, and hackathons.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Loading Team Members...
        </div>
      ) : (
        <>
          {/* President */}
          {president && (
            <div className="mb-14">
              <div className="card p-0 overflow-hidden bg-[var(--surface)] border border-border hover:border-white/20 transition-all duration-300 grid md:grid-cols-2 max-w-3xl mx-auto">
                <div className="overflow-hidden relative aspect-square border-b md:border-b-0 md:border-r border-border">
                  <img
                    src={president.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400'}
                    alt={president.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center bg-transparent">
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-white bg-white/10 px-2.5 py-1 inline-block border border-white/10 rounded-none mb-3 w-max">
                    {president.designation}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">
                    {president.name}
                  </h3>
                  {president.details && (
                    <p className="mt-4 text-sm text-muted leading-relaxed">{president.details}</p>
                  )}
                  {(president.linkedin || president.instagram || president.facebook) && (
                    <div className="flex gap-4 mt-6">
                      {president.linkedin && <a href={president.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors"><FaLinkedinIn size={14} /></a>}
                      {president.instagram && <a href={president.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors"><FaInstagram size={14} /></a>}
                      {president.facebook && <a href={president.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors"><FaFacebookF size={14} /></a>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leads */}
          {leads.length > 0 && (
            <div className="mb-14">
              <h2 className="text-lg font-bold uppercase tracking-tight mb-6 text-center">Team Leads</h2>
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {leads.map(p => <TeamCard key={p.id} member={p} />)}
              </div>
            </div>
          )}

          {/* Other Members */}
          {others.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight mb-6 text-center">Members</h2>
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {others.map(p => <TeamCard key={p.id} member={p} />)}
              </div>
            </div>
          )}

          {!president && leads.length === 0 && others.length === 0 && (
            <div className="col-span-full border border-border p-20 text-center text-sm text-muted bg-surface">
              No team members listed yet. Add them in the Admin Dashboard!
            </div>
          )}
        </>
      )}
    </div>
  )
}
