'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import EventCard from './EventCard';

export default function EventsSection() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, events.length - 1), [events.length]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          // Format DB entries to fit section styling
          const formatted = data.map(e => ({
            id: e.id,
            title: e.title,
            date: new Date(e.date).toLocaleDateString(undefined, { dateStyle: 'medium' }),
            img: e.images?.[0]?.url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
            excerpt: e.description ? e.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : 'Explore scheduled society events and hands-on developer training.'
          }))
          setEvents(formatted)
        } else {
          setEvents([])
        }
        setLoading(false)
      })
      .catch(() => {
        setEvents([])
        setLoading(false)
      })
  }, [])

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i]; if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' });
  };

  const go = (dir) => {
    setIndex((v) => Math.min(Math.max(v + dir, 0), maxIndex));
  };

  useEffect(() => { scrollToCard(index); }, [index]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const diff = Math.abs(child.offsetLeft - 20 - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });
    if (closestIndex !== index) {
      setIndex(closestIndex);
    }
  };

  return (
    <section id="events" className="section pt-16 pb-6 md:pt-24 md:pb-8">
      <div className="section-header text-center mb-12">
        <span className="label justify-center">Recent Events</span>
        <h2 className="section-title mt-2">Latest Events</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase border border-border/50 bg-[var(--surface)]">
          No upcoming society events scheduled.
        </div>
      ) : (
        <div className="relative px-12 md:px-0">
          {events.length > 1 && (
            <>
              <button 
                onClick={() => go(-1)}
                className="slider-nav left-1 md:-left-16 z-20 hover:bg-white hover:text-black transition-all duration-300"
                disabled={index === 0}
                aria-label="Prev"
              >
                ‹
              </button>
              <button 
                onClick={() => go(1)}
                className="slider-nav right-1 md:-right-16 z-20 hover:bg-white hover:text-black transition-all duration-300"
                disabled={index === maxIndex}
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          <ul
            ref={trackRef}
            onScroll={handleScroll}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4"
          >
            {events.map((e, idx) => (
              <li 
                key={idx} 
                className="snap-start shrink-0 w-[220px] md:w-[250px]"
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
