'use client'
import { useState } from 'react'

const faqs = [
  'What is the Computer Science Society (CSS) at IIUI?',
  'Who can join CSS?',
  'What kind of events does CSS organize?',
  'How can I participate in CSS events?',
]

export default function FAQSection(){
  const [open,setOpen]=useState(0)
  return (
    <section className="section py-12 md:py-16">
      <h2 className="section-title text-center">FAQs</h2>

      {/* Added contrast: bg only, no border */}
      <div className="mt-6 max-w-3xl mx-auto rounded-2xl bg-black/40 px-3 sm:px-4 md:px-6 py-2 md:py-3">
        {faqs.map((q,i)=> (
          <div key={i} className={`border-b border-white/10 ${i===faqs.length-1 ? 'border-none' : ''}`}>
            <button
              className="w-full text-left py-4 px-2 flex items-center justify-between rounded-lg hover:bg-white/5"
              onClick={()=> setOpen(o=> o===i?null:i)}
            >
              <span className="font-semibold">{q}</span>
              <span className="text-xl">{open===i? '–' : '+'}</span>
            </button>

            {open===i && (
              <div className="pb-4 px-2 text-white/80 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
