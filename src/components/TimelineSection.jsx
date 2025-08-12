// components/TimelineSection.jsx
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TimelineSection({
  title = 'Timeline',
  items = [
    { id:1, year:'2024', date:'16 Aug 2024', title:'Department Orientation',
      image:'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1400&auto=format&fit=crop',
      text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id:2, year:'2024', date:'02 Sep 2024', title:'Workshop Highlights',
      image:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop',
      text:'Quisque sed libero sit amet condimentum.' },
    { id:3, year:'2024', date:'18 Sep 2024', title:'Tech Talk',
      image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
      text:'Donec posuere arcu sit amet elit laoreet.' },
    { id:4, year:'2024', date:'26 Oct 2024', title:'Community Meetup',
      image:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
      text:'Integer at urna eget justo molestie varius.' },
  ],
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, items.length - 1), [items.length]);

  // Axis + spacing
  const AXIS_TOP_PX = 64;           // higher line (adds a touch more padding)
  const MARKER_TO_CARD_GAP_PX = 28; // extra gap between line and cards
  const DIAMOND_PX = 12;            // 3 * 4px tailwind unit
  const LINE_THICKNESS = 2;

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i];   if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  };

  // Page step = how many cards fit; arrows jump by page (not 1-by-1)
  const getPageStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 1;
    const first = track.children[0];
    const second = track.children[1];
    let stride = first.getBoundingClientRect().width;
    if (second) stride = Math.max(1, second.offsetLeft - first.offsetLeft); // includes gap
    return Math.max(1, Math.round(track.clientWidth / stride));
  };

  const goPage = (dir) => {
    const step = getPageStep();
    setIndex((v) => Math.min(Math.max(v + dir * step, 0), maxIndex));
  };

  // Drag / swipe + snap
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    let down=false, startX=0, startScroll=0;
    const onDown = (e)=>{down=true; startX=(e.touches?e.touches[0]:e).clientX; startScroll=track.scrollLeft;};
    const onMove = (e)=>{ if(!down) return; const x=(e.touches?e.touches[0]:e).clientX; track.scrollLeft=startScroll+(startX-x); };
    const snap = ()=>{ if(!down) return; down=false; let n=0,m=1e9;
      for(let i=0;i<track.children.length;i++){const c=track.children[i]; const d=Math.abs(c.offsetLeft-track.scrollLeft); if(d<m){m=d;n=i;}}
      setIndex(n);
    };
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', snap);
    track.addEventListener('pointercancel', snap);
    track.addEventListener('touchstart', onDown, { passive:true });
    track.addEventListener('touchmove', onMove, { passive:true });
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

  // fixed card height + narrow widths
  const CARD_W = 'w-[15.5rem] sm:w-[16.5rem] md:w-[17rem] lg:w-[18rem]';
  const CARD_H = 360; // px — make all cards equal height

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">{title}</h2>

      <div className="relative z-10">
        {/* Single axis line (raised) */}
        <div
          className="pointer-events-none absolute left-1/2 z-0 hidden h-[2px] w-[min(100%,64rem)] -translate-x-1/2 md:block"
          style={{ top: AXIS_TOP_PX, background: 'rgba(255,255,255,0.22)' }}
        />

        {/* Circular nav buttons on the line (page jump) */}
        <button
          onClick={() => goPage(-1)}
          className="absolute -left-2 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition md:block"
          style={{ top: AXIS_TOP_PX, background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={() => goPage(1)}
          className="absolute -right-2 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition md:block"
          style={{ top: AXIS_TOP_PX, background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Next"
        >
          ›
        </button>

        <ul
          ref={trackRef}
          className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible scroll-smooth"
          style={{ maxWidth: '64rem' }}
        >
          {items.map((it) => (
            <li
              key={it.id}
              className="relative snap-start"
              // push cards down so they clear the raised line + leave nice gap
              style={{ scrollMarginLeft: '16px', paddingTop: AXIS_TOP_PX + MARKER_TO_CARD_GAP_PX }}
            >
              {/* Marker group aligned to the axis; diamond centered vertically on line */}
              <div
                className="absolute left-1/2 top-0 hidden md:block"
                style={{ transform: 'translateX(-50%)' }}
              >
                {/* Diamond centered on the line */}
                <span
                  className="absolute block rotate-45"
                  style={{
                    left: '50%',
                    top: AXIS_TOP_PX,
                    width: DIAMOND_PX,
                    height: DIAMOND_PX,
                    transform: 'translate(-50%, -50%)', // centers on line vertically & horizontally
                    background: '#fff',
                  }}
                />
                {/* Year pill above the diamond */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ top: AXIS_TOP_PX - (DIAMOND_PX / 2) - 10 /* small gap above */ }}
                >
                  <span className="rounded bg-white px-3 py-1 text-xs font-semibold text-black shadow">
                    {it.year}
                  </span>
                </div>
              </div>

              {/* Card — exact style requested; fixed equal height */}
              <article
                className={`group relative ${CARD_W} h-[${CARD_H}px] bg-black/40 border border-white/10 rounded-lg p-2 text-center shadow-sm backdrop-blur transition`}
              >
                {/* Hover lift ring (optional subtle) */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-lg ring-0 transition group-hover:ring-1"
                  style={{ '--tw-ring-color': 'rgba(255,255,255,0.95)' }}
                  aria-hidden
                />
                <div className="overflow-hidden rounded-md">
                  <img
                    src={it.image}
                    alt=""
                    className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    draggable={false}
                  />
                </div>

                {/* Date ALWAYS visible */}
                <div className="mt-3 text-xs opacity-90">{it.date}</div>
                <h3 className="mt-1 text-base font-semibold">{it.title}</h3>
                <p className="mt-1 text-sm opacity-85">{it.text}</p>
                {/* Spacer to keep consistent bottom padding if text is short */}
                <div className="mt-auto" />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
