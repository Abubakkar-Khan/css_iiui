'use client'
import { useState } from 'react'

const faqs = [
  { q: 'What is the Computer Science Society (CSS) at IIUI?', a: 'CSS is the official student society of the Computer Science department at International Islamic University, Islamabad. We organize events, workshops, and community activities to foster growth in technology.' },
  { q: 'Who can join CSS?', a: 'Any student enrolled in the Computer Science department at IIUI can join CSS. We welcome students from all semesters and backgrounds.' },
  { q: 'What kind of events does CSS organize?', a: 'We organize hackathons, tech talks, workshops, coding competitions, seminars, and community meetups throughout the academic year.' },
  { q: 'How can I participate in CSS events?', a: 'Follow our social media channels and check the Events page for upcoming activities. Most events are free and open to all CS students.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section py-16 md:py-32">
      <div className="text-center mb-16">
        <span className="label justify-center">Common Protocol</span>
        <h2 className="section-title mt-4">FAQ</h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="border border-border bg-surface transition-all duration-300 hover:border-white/20"
          >
            <button
              className="w-full text-left py-6 px-8 flex items-center justify-between group"
              onClick={() => setOpen(o => o === i ? null : i)}
            >
              <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${open === i ? 'text-white' : 'text-muted'}`}>
                {item.q}
              </span>
              <span className={`text-muted text-lg ml-4 shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}>
                {open === i ? '−' : '+'}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open === i ? 'max-h-60 pb-8 px-8' : 'max-h-0'
              }`}
            >
              <div className="h-px bg-border mb-6" />
              <p className="text-xs text-muted leading-relaxed font-medium">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
