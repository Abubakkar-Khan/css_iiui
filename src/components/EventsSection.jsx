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
    <section id="events" className="section pt-16 pb-6 md:pt-24 md:pb-8">
      <div className="section-header flex items-end justify-between">
        <div>
          <span className="label">Activity Log</span>
          <h2 className="section-title mt-2">Latest Events</h2>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => go(-1)}
          className="slider-nav -left-4 md:-left-6 z-20 hover:bg-white hover:text-black transition-colors"
          disabled={index === 0}
          aria-label="Prev"
        >
          ‹
        </button>
        <button 
          onClick={() => go(1)}
          className="slider-nav -right-4 md:-right-6 z-20 hover:bg-white hover:text-black transition-colors"
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
              className="snap-start shrink-0 w-[220px] md:w-[250px] transition-all duration-300"
            >
              <article className="card flex flex-col group/card overflow-hidden bg-black h-full border border-border">
                {/* Square Image */}
                <div className="overflow-hidden aspect-square border-b border-border relative">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="h-full w-full object-cover brightness-95 transition-all duration-500 group-hover/card:scale-105"
                    draggable={false}
                  />
                  <div className="absolute top-2 left-2 font-mono text-[6px] bg-black/85 px-1.5 py-0.5 border border-white/10 opacity-70">
                    EV {idx + 1}
                  </div>
                </div>
                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-surface">
                  <div>
                    <span className="text-[7px] font-mono text-muted uppercase tracking-wider block mb-1">{e.date}</span>
                    <h3 className="text-[11px] font-black uppercase tracking-tight text-white line-clamp-1 group-hover/card:text-muted transition-colors leading-tight">{e.title}</h3>
                    <p className="mt-1 text-[10px] text-muted leading-relaxed line-clamp-2">{e.excerpt}</p>
                  </div>
                  <div className="pt-2 mt-4 border-t border-border/40">
                    <a className="text-[8px] font-mono uppercase text-white hover:text-muted transition-colors block text-right font-bold" href="/events">Details →</a>
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
