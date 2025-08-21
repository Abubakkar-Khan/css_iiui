// components/EventsSection.jsx
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function EventsSection({ items = [] }) {
  const events = items.length
    ? items
    : Array.from({ length: 8 }).map(() => ({
        title: 'IT Department Orientation 2024',
        date: '2 Sep 2024',
        img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }));

  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, events.length - 1), [events.length]);

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i];  if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  };

  const getPageStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 1;
    const a = track.children[0], b = track.children[1];
    let stride = a.getBoundingClientRect().width;
    if (b) stride = Math.max(1, b.offsetLeft - a.offsetLeft);
    return Math.max(1, Math.round(track.clientWidth / stride));
  };

  const goPage = (dir) => {
    const step = getPageStep();
    setIndex((v) => Math.min(Math.max(v + dir * step, 0), maxIndex));
  };

  // Drag/swipe
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    let down = false, startX = 0, startScroll = 0;
    const getX = (e) => (e.touches ? e.touches[0] : e).clientX;
    const onDown = (e) => { down = true; startX = getX(e); startScroll = track.scrollLeft; };
    const onMove = (e) => { if (!down) return; track.scrollLeft = startScroll + (startX - getX(e)); };
    const snap = () => {
      if (!down) return; down = false;
      let nearest = 0, min = Infinity;
      for (let i = 0; i < track.children.length; i++) {
        const c = track.children[i];
        const d = Math.abs(c.offsetLeft - track.scrollLeft);
        if (d < min) { min = d; nearest = i; }
      }
      setIndex(nearest);
    };
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', snap);
    track.addEventListener('pointercancel', snap);
    track.addEventListener('touchstart', onDown, { passive: true });
    track.addEventListener('touchmove', onMove, { passive: true });
    track.addEventListener('touchend', snap);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', snap);
      track.removeEventListener('pointercancel', snap);
      track.removeEventListener('touchstart', onDown);
      track.removeEventListener('touchmove', onMove);
      track.removeEventListener('touchend', snap);
    };
  }, []);

  useEffect(() => { scrollToCard(index); }, [index]);

  // ✅ Bigger fixed dimensions
  const CARD_W = 300; // px
  const CARD_H = 400; // px

  return (
    <section id="events" className="section py-12 md:py-16">
      <h2 className="section-title text-center">Events</h2>

      <div className="relative mt-8">
        {/* Arrows */}
        <button
          onClick={() => goPage(-1)}
          className="absolute -left-2 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full transition"
          style={{ background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Previous"
        >‹</button>
        <button
          onClick={() => goPage(1)}
          className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full transition"
          style={{ background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Next"
        >›</button>

        {/* Track */}
        <ul
          ref={trackRef}
          className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible scroll-smooth"
          style={{ maxWidth: '64rem' }}
        >
          {events.map((e, idx) => (
            <li
              key={idx}
              className="snap-start shrink-0"
              style={{ scrollMarginLeft: '16px', width: CARD_W }}
            >
              <article
                className="card rounded-lg p-2 text-left bg-black/40 transition hover:-translate-y-0.5 flex flex-col"
                style={{ border: 0, height: CARD_H }}
              >
                <img
                  src={e.img}
                  alt="event"
                  className="rounded-md mb-4 aspect-[4/3] w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.02]"
                  draggable={false}
                />
                <div className="text-xs uppercase text-white/70">{e.date}</div>
                <h3 className="mt-1 font-bold leading-snug">{e.title}</h3>
                <p className="mt-2 text-sm text-white/80 line-clamp-3">{e.excerpt}</p>
                <div className="mt-auto pt-2">
                  <a className="btn-ghost" href="/events">Read More</a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
