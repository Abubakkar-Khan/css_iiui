// src/app/events/[id]/page.jsx
import db from '@/lib/db';
import Link from 'next/link';
import EventSlideshow from '@/components/EventSlideshow';

export const revalidate = 0;

export default async function EventPage({ params }) {
  const id = Number(params.id);
  
  // Fallbacks for demo
  const mockEvents = {
    1: { title: 'Freshmen Orientation', date: 'Aug 16, 2024', img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600', description: 'Welcoming the new batch to the Department of Computer Science and introducing them to academic and community life.' },
    2: { title: 'Git & Github Workshop', date: 'Sep 02, 2024', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600', description: 'Hands-on training session on version control, branching strategies, and open-source contributions.' },
  }

  let ev = null;
  try {
    const evRes = await db.query('SELECT * FROM "Event" WHERE "id" = $1', [id]);
    if (evRes.rows.length > 0) {
      ev = evRes.rows[0];
      const imagesRes = await db.query('SELECT * FROM "Image" WHERE "eventId" = $1', [id]);
      ev.images = imagesRes.rows;
    }
  } catch (err) {
    console.error("Failed to fetch event with SQL", err);
  }

  // Fallback to mock data if not in DB
  if (!ev) {
    ev = mockEvents[id];
  }

  if (!ev) return (
    <div className="section py-20 text-center">
      <h1 className="section-title">Event Not Found</h1>
      <Link href="/events" className="btn mt-8">Back to Events</Link>
    </div>
  );

  const slideshowImages = ev.images && ev.images.length > 0 
    ? ev.images.map(i => i.url) 
    : [ev.imageUrl || ev.img || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600'];

  return (
    <div className="section py-12 md:py-20">
      <Link href="/events" className="label hover:text-white transition-colors">← Back to Events</Link>
      
      {/* Dynamic Slideshow */}
      <div className="mt-8 border border-border overflow-hidden">
        <EventSlideshow images={slideshowImages} title={ev.title} />
      </div>

      <div className="mt-12 max-w-3xl">
        <span className="label">{new Date(ev.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 uppercase tracking-tight text-white">{ev.title}</h1>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <span className="text-[10px] uppercase font-mono tracking-wider px-3 py-1 bg-white/5 border border-border/40 text-muted">
            Type: {ev.eventType || 'Workshop'}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-3 py-1 bg-white/5 border border-border/40 text-muted">
            Format: {ev.locationType || 'OFFLINE'}
          </span>
          {ev.venue && (
            <span className="text-[10px] uppercase font-mono tracking-wider px-3 py-1 bg-white/5 border border-border/40 text-muted">
              Venue: {ev.venue}
            </span>
          )}
        </div>

        <div className="mt-12 prose prose-invert max-w-none text-muted leading-relaxed">
          <p className="whitespace-pre-wrap">{ev.description}</p>
          <p className="mt-8 italic text-xs text-muted border-t border-border/40 pt-4">
            Note: This is a historical record of the event. For more information regarding our future calendar, 
            please check the main events roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
