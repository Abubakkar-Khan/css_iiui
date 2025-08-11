'use client'
import { useState } from 'react'
const slides=[
  { title:'Random CSS Event NEWS 101', body:'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop', date:'Aug 16, 2024' },
  { title:'Workshop Highlights', body:'Sed tincidunt erat at nunc ultricies, vitae auctor massa condimentum.', img:'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop', date:'Sep 2, 2024' },
]
export default function Hero(){
  const [i,setI]=useState(0); const go=dir=>setI(v=>(v+dir+slides.length)%slides.length); const s=slides[i]
  return (
    <section className="section mt-4 md:mt-6" id="hero">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow">
        <img src={s.img} alt="slide" className="w-full h-[42vh] md:h-[56vh] object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute left-6 right-6 bottom-6 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-white/70">{s.date}</p>
          <h1 className="text-2xl md:text-4xl font-extrabold max-w-3xl">{s.title}</h1>
          <p className="max-w-2xl text-white/85">{s.body}</p>
          <div className="mt-3"><a className="btn" href="/events">Read more</a></div>
        </div>
        <button aria-label="Prev" onClick={()=>go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 btn-ghost">‹</button>
        <button aria-label="Next" onClick={()=>go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost">›</button>
      </div>
    </section>
  )
}