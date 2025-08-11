'use client'
import { useState } from 'react'
const faqs=['What is the Computer Science Society (CSS) at IIUI?','Who can join CSS?','What kind of events does CSS organize?','How can I participate in CSS events?']
export default function FAQSection(){
  const [open,setOpen]=useState(0)
  return (
    <section className="section py-12 md:py-16">
      <h2 className="section-title text-center">FAQs</h2>
      <div className="mt-6 max-w-3xl mx-auto">
        {faqs.map((q,i)=> (
          <div key={i} className="border-b border-white/10">
            <button className="w-full text-left py-4 flex items-center justify-between" onClick={()=> setOpen(o=> o===i?null:i)}>
              <span className="font-semibold">{q}</span>
              <span className="text-xl">{open===i? '–' : '+'}</span>
            </button>
            {open===i && (<div className="pb-4 text-white/80 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>)}
          </div>
        ))}
      </div>
    </section>
  )
}