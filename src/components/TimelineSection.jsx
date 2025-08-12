// components/TimelineSection.jsx
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TimelineSection({
  title = 'Timeline',
  subtitle = 'Key moments & milestones from our journey.',
  items = [
    { id:1, year:'2024', date:'16 Aug 2024', title:'Department Orientation',
      image:'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1400&auto=format&fit=crop',
      text:'Kickstarting the semester with a full house, onboarding, and project picks.' },
    { id:2, year:'2024', date:'02 Sep 2024', title:'Workshop Highlights',
      image:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop',
      text:'Hands-on session: Git, Next.js basics, and deployment gotchas.' },
    { id:3, year:'2024', date:'18 Sep 2024', title:'Tech Talk',
      image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
      text:'Guest speaker on AI in security — demos, Q&A, and resources.' },
    { id:4, year:'2024', date:'26 Oct 2024', title:'Community Meetup',
      image:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
      text:'Show-and-tell, lightning talks, and networking over snacks.' },
  ],
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, items.length - 1), [items.length]);

  /* Match CompuLink “background shows through” feel */
  const AXIS_TOP = 120;       // line Y
  const DATE_GAP = 24;        // date ↕ line
  const DIAMOND = 14;         // marker size
  const LINE_CARD_GAP = 36;   // line/diamond ↕ card
  const CARD_H = 320;         // equal-height cards (adjust if needed)
  const CARD_W = 'w-[15.5rem] sm:w-[16.5rem] md:w-[17rem] lg:w-[18rem]';

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i];   if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  };

  // Arrows jump by visible page
  const getPageStep = () => {
    const track = trackRef.current;
    if (!track || !track.children.length) return 1;
    const a = track.children[0], b = track.children[1];
    let stride = a.getBoundingClientRect().width;
    if (b) stride = Math.max(1, b.offsetLeft - a.offsetLeft);
    return Math.max(1, Math.round(track.clientWidth / stride));
  };
  const goPage = (dir) => {
    const step = getPageStep();
    setIndex((v) => Math.min(Math.max(v + dir * step, 0), maxIndex));
  };

  // Drag/swipe + snap
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    let down=false, startX=0, startScroll=0;
    const onDown = (e)=>{down=true; startX=(e.touches?e.touches[0]:e).clientX; startScroll=track.scrollLeft;};
    const onMove = (e)=>{ if(!down) return; const x=(e.touches?e.touches[0]:e).clientX; track.scrollLeft=startScroll+(startX-x); };
    const snap   = ()=>{ if(!down) return; down=false; let n=0,m=1e9;
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

  return (
    <section id="timeline" className="section py-12 md:py-16 relative mx-auto max-w-6xl px-4" style={{ overflow: 'visible' }}>
      <h2 className="section-title text-center">{title}</h2>
      <p className="mt-2 text-center text-sm opacity-80">{subtitle}</p>

      <div className="relative z-10 mt-8" style={{ overflow: 'visible' }}>
        {/* Main horizontal line (transparent around, so page BG shows) */}
        <div
          className="pointer-events-none absolute left-1/2 z-0 hidden -translate-x-1/2 md:block"
          style={{
            top: AXIS_TOP,
            width: 'min(100%, 64rem)',
            height: 2,
            background: 'rgba(255,255,255,0.22)',
          }}
        />

        {/* Circular arrows on the line (page jump) */}
        <button
          onClick={() => goPage(-1)}
          className="absolute -left-2 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full transition md:block"
          style={{ top: AXIS_TOP, background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Previous"
        >‹</button>
        <button
          onClick={() => goPage(1)}
          className="absolute -right-2 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full transition md:block"
          style={{ top: AXIS_TOP, background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Next"
        >›</button>

        <ul
          ref={trackRef}
          className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible scroll-smooth"
          style={{ maxWidth: '64rem' }}
        >
          {items.map((it) => (
            <li
              key={it.id}
              className="relative snap-start"
              /* DATE → LINE+DIAMOND → GAP → CARD */
              style={{ scrollMarginLeft: '16px', paddingTop: AXIS_TOP + DIAMOND / 2 + LINE_CARD_GAP }}
            >
              {/* DATE above the line */}
              <div
                className="absolute left-1/2 text-center"
                style={{
                  top: AXIS_TOP,
                  transform: `translate(-50%, calc(-100% - ${DATE_GAP}px))`,
                }}
              >
                <span className="rounded bg-white px-3 py-1 text-xs font-semibold text-black shadow">
                  {it.date}
                </span>
              </div>

              {/* Diamond centered on the line (true 45°) */}
              <span
                className="absolute block"
                style={{
                  left: '50%',
                  top: AXIS_TOP,
                  width: `${DIAMOND}px`,
                  height: `${DIAMOND}px`,
                  background: '#fff',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
              />

              {/* CARD — same feel as BlogSection cards */}
              <article
                className={`card bg-black/40 border border-white/10 rounded-lg p-2 text-center transition flex flex-col
                            hover:-translate-y-0.5`}
                style={{ height: `${CARD_H}px` }}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={it.image}
                    alt=""
                    className="h-44 w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.02]"
                    draggable={false}
                  />
                </div>

                <h3 className="mt-3 text-base font-extrabold leading-snug">{it.title}</h3>
                <p
                  className="mt-1 text-sm text-white/80"
                  style={{ display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}
                >
                  {it.text}
                </p>

                <div className="mt-auto pt-2 text-xs text-white/70">Tap for details</div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
