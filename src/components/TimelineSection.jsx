// src/components/TimelineSection.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { optimizeImageUrl } from '@/lib/images';

export default function TimelineSection({
  title = 'Our Journey',
  subtitle = 'History & Milestones',
  items = [
    { id:1, date:'Aug 2024', title:'Initialization', image:'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop', text:'Onboarding and primary system setup for the new semester batch.' },
    { id:2, date:'Sep 2024', title:'Version Control', image:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop', text:'Implementing collaborative development standards and Git training.' },
    { id:3, date:'Sep 2024', title:'Security Breach Talk', image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop', text:'Deep dive into system exploits and defensive security frameworks.' },
    { id:4, date:'Oct 2024', title:'Node Sync', image:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', text:'Synchronizing community resources and project sprint reviews.' },
    { id:5, date:'Nov 2024', title:'Production Sprint', image:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', text:'Overnight development session targeting core prototype delivery.' },
    { id:6, date:'Dec 2024', title:'Upstreaming', image:'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop', text:'Finalizing project contributions and society documentation.' },
    { id:7, date:'Jan 2025', title:'New Cycle', image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop', text:'Roadmap update for 2025. Committee re-allocation and goal setting.' },
    { id:8, date:'Feb 2025', title:'Ops Mini-Camp', image:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop', text:'Deployment pipelines and cloud infrastructure crash course.' },
  ],
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i]; if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' });
  };

  const go = (dir) => {
    const next = Math.min(Math.max(index + dir, 0), items.length - 1);
    setIndex(next);
  };

  useEffect(() => { scrollToCard(index); }, [index]);

  const CARD_W = 280;
  const AXIS_Y = 120;

  return (
    <section className="section py-16 md:py-32 relative" style={{ overflow: 'visible' }}>
      <div className="text-center mb-16">
        <span className="label justify-center">{subtitle}</span>
        <h2 className="section-title mt-4">{title}</h2>
      </div>

      <div className="relative group" style={{ overflow: 'visible' }}>
        {/* Navigation Buttons - Left & Right */}
        <button 
          onClick={() => go(-1)}
          className="slider-nav -left-4 md:-left-8 opacity-0 group-hover:opacity-100 disabled:opacity-0"
          style={{ top: AXIS_Y + 120 }}
          disabled={index === 0}
          aria-label="Prev"
        >
          ‹
        </button>
        <button 
          onClick={() => go(1)}
          className="slider-nav -right-4 md:-right-8 opacity-0 group-hover:opacity-100 disabled:opacity-0"
          style={{ top: AXIS_Y + 120 }}
          disabled={index === items.length - 1}
          aria-label="Next"
        >
          ›
        </button>

        {/* Horizontal axis line */}
        <div
          className="absolute left-0 right-0 hidden md:block pointer-events-none"
          style={{ top: AXIS_Y, height: '1px', background: 'var(--border)' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-r border-t border-border rotate-45" />
        </div>

        <ul
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto overflow-y-visible scroll-smooth pb-8"
        >
          {items.map((it, idx) => (
            <li
              key={it.id}
              className="relative snap-start shrink-0 group/card transition-all duration-500 ease-out"
              style={{ 
                width: CARD_W, 
                paddingTop: AXIS_Y + 60,
                transform: index === idx ? 'scale(1)' : 'scale(0.95)',
                opacity: index === idx ? 1 : 0.6
              }}
            >
              {/* Metadata above axis */}
              <div
                className="absolute left-1/2 -translate-x-1/2 text-center"
                style={{ top: AXIS_Y - 40 }}
              >
                <div className="font-mono text-[8px] text-muted tracking-tighter mb-1">STAMP_{it.id.toString().padStart(2, '0')}</div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">{it.date}</div>
              </div>

              {/* Marker on axis */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 transition-all duration-300 hidden md:block"
                style={{
                  top: AXIS_Y - 4,
                  background: index === idx ? 'white' : 'transparent',
                  border: '1px solid #333',
                  boxShadow: index === idx ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                }}
              />

              {/* Card */}
              <article className="card p-0 overflow-hidden flex flex-col h-[320px] transition-all duration-500 group-hover/card:border-white/30">
                <div className="overflow-hidden h-36 relative bg-black/20">
                  <Image
                    src={optimizeImageUrl(it.image, 400, 300)}
                    alt=""
                    width={400}
                    height={300}
                    className="h-full w-full object-cover brightness-90 transition-transform duration-700 group-hover/card:brightness-100 group-hover/card:scale-105"
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-sm font-black uppercase tracking-tight leading-snug text-white">{it.title}</h3>
                  <p className="mt-3 text-[11px] text-muted leading-relaxed line-clamp-4 font-medium">{it.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
