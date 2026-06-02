'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import EventCard from './EventCard';

export default function EventsSection({ initialEvents = [] }) {
  const formatEvents = (data) => {
    if (data && Array.isArray(data)) {
      return data.map(e => ({
        id: e.id,
        title: e.title,
        date: new Date(e.date).toLocaleDateString(undefined, { dateStyle: 'medium' }),
        img: e.images?.[0]?.url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
        excerpt: e.description ? e.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : 'Explore scheduled society events and hands-on developer training.'
      }))
    }
    return []
  }

  const [events, setEvents] = useState(() => formatEvents(initialEvents))
  const [loading, setLoading] = useState(initialEvents.length === 0)

  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, events.length - 1), [events.length]);

  useEffect(() => {
    if (initialEvents.length > 0) return
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(formatEvents(data))
        setLoading(false)
      })
      .catch(() => {
        setEvents([])
        setLoading(false)
      })
  }, [initialEvents])

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
      <div className="section-header text-center mb-12">
        <span className="label justify-center">Recent Events</span>
        <h2 className="section-title mt-2">Latest Events</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Syncing events calendar...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase border border-border/50 bg-[var(--surface)]">
          No upcoming society events scheduled.
        </div>
      ) : (
        <div className="relative">
          {events.length > 1 && (
            <>
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
            </>
          )}

          <ul
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4"
          >
            {events.map((e, idx) => (
              <li 
                key={idx} 
                className="snap-start shrink-0 w-[220px] md:w-[250px] transition-all duration-300"
              >
                <EventCard event={e} index={idx} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
