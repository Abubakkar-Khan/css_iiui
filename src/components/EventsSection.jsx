'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function EventsSection({ items = [] }) {
  const events = items.length
    ? items
    : [
        { title: 'Orientation Protocol', date: '16 Aug 2024', img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop', excerpt: 'Onboarding session for new entries. Introduction to society frameworks and roadmap.' },
        { title: 'Dev Environment: Git', date: '02 Sep 2024', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop', excerpt: 'Core version control training. Branching strategies and collaborative workflows.' },
        { title: 'System Security Lab', date: '18 Sep 2024', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop', excerpt: 'Adversarial machine learning and network defense strategies. Live exploit demos.' },
        { title: 'Community Node Sync', date: '26 Oct 2024', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', excerpt: 'Internal meetup and project synchronization. Networking and resource allocation.' },
        { title: 'Night Shift: Build', date: '12 Nov 2024', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', excerpt: 'Intensive building session. Zero-to-one prototyping. Coffee and compilers.' },
        { title: 'Open Source Cluster', date: '03 Dec 2024', img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop', excerpt: 'Upstreaming local tools. Contribution sprints and documentation polish.' },
      ];

  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, events.length - 1), [events.length]);

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i]; if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' });
  };

  const go = (dir) => {
    setIndex((v) => Math.min(Math.max(v + dir, 0), maxIndex));
  };

  useEffect(() => { scrollToCard(index); }, [index]);

  return (
    <section id="events" className="section py-16 md:py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="label">Activity Log</span>
          <h2 className="section-title mt-2">Latest Events</h2>
        </div>
      </div>

      <div className="relative group">
        {/* Navigation Buttons - Left & Right */}
        <button 
          onClick={() => go(-1)}
          className="slider-nav -left-4 md:-left-6 opacity-0 group-hover:opacity-100 disabled:opacity-0"
          disabled={index === 0}
          aria-label="Prev"
        >
          ‹
        </button>
        <button 
          onClick={() => go(1)}
          className="slider-nav -right-4 md:-right-6 opacity-0 group-hover:opacity-100 disabled:opacity-0"
          disabled={index === maxIndex}
          aria-label="Next"
        >
          ›
        </button>

        <ul
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4"
        >
          {events.map((e, idx) => (
            <li 
              key={idx} 
              className="snap-start shrink-0 w-[320px] md:w-[380px] transition-all duration-500 ease-out"
              style={{
                transform: idx === index ? 'scale(1)' : 'scale(0.95)',
                opacity: idx === index ? 1 : 0.6,
              }}
            >
              <article className="card flex flex-col h-[450px] group/card overflow-hidden">
                <div className="overflow-hidden h-52 relative">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="h-full w-full object-cover brightness-90 transition-all duration-700 group-hover/card:brightness-100 group-hover/card:scale-105"
                    draggable={false}
                  />
                  <div className="absolute top-4 left-4 font-mono text-[8px] bg-black/80 px-2 py-1 border border-white/10 opacity-60">
                    LOG_ID: {idx.toString().padStart(4, '0')}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="label text-[9px] mb-2">{e.date}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight leading-tight">{e.title}</h3>
                  <p className="mt-4 text-xs text-muted leading-relaxed line-clamp-3 font-medium">{e.excerpt}</p>
                  <div className="mt-auto pt-6">
                    <a className="btn-ghost text-[9px] w-full py-2" href="/events">Initialize Protocol →</a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
