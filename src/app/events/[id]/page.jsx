// src/app/events/[id]/page.jsx
import db from '@/lib/db';
import Link from 'next/link';
import EventSlideshow from '@/components/EventSlideshow';

export const revalidate = 0;

export default async function EventPage({ params }) {
  const { id } = await params;
  const numId = Number(id);

  let ev = null;
  if (Number.isFinite(numId)) {
    try {
      const evRes = await db.query('SELECT * FROM "Event" WHERE "id" = $1', [numId]);
      if (evRes.rows.length > 0) {
        ev = evRes.rows[0];
        const imagesRes = await db.query('SELECT * FROM "Image" WHERE "eventId" = $1', [numId]);
        ev.images = imagesRes.rows;
      }
    } catch (err) {
      console.error("Failed to fetch event with SQL", err);
    }
  }

  if (!ev) {
    return (
      <div className="section py-32 text-center">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">Event Not Found</h1>
        <p className="text-muted text-base mt-4">The event you are looking for has expired or does not exist.</p>
        <Link href="/events" className="btn mt-8 inline-block">Back to Events</Link>
      </div>
    );
  }

  const slideshowImages = ev.images && ev.images.length > 0 
    ? ev.images.map(i => ({ url: i.url, caption: i.caption || '' })) 
    : [{ url: ev.imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600', caption: '' }];

  return (
    <div className="section py-16 md:py-24">
      <Link href="/events" className="text-sm font-bold uppercase tracking-widest text-muted hover:text-white transition-colors">
        ← Back to Events
      </Link>
      
      {/* Slideshow */}
      <div className="mt-8 border border-border overflow-hidden">
        <EventSlideshow images={slideshowImages} title={ev.title} />
      </div>

      <div className="mt-12 max-w-4xl">
        <span className="text-sm font-mono tracking-widest text-muted uppercase font-bold">
          {new Date(ev.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
        </span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 uppercase tracking-tighter text-white leading-tight">
          {ev.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <span className="text-sm uppercase font-mono tracking-wider px-4 py-2 bg-white/5 border border-border/40 text-muted font-semibold">
            Type: {ev.eventType || 'Workshop'}
          </span>
          <span className="text-sm uppercase font-mono tracking-wider px-4 py-2 bg-white/5 border border-border/40 text-muted font-semibold">
            Format: {ev.locationType || 'OFFLINE'}
          </span>
          {ev.venue && (
            <span className="text-sm uppercase font-mono tracking-wider px-4 py-2 bg-white/5 border border-border/40 text-muted font-semibold">
              Venue: {ev.venue}
            </span>
          )}
        </div>

        {/* Register Button */}
        {ev.registrationLink && (
          <div className="mt-10">
            <a
              href={ev.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest px-10 py-4 bg-fg text-bg border border-fg hover:bg-transparent hover:text-fg transition-all duration-300"
            >
              Register for Event →
            </a>
          </div>
        )}

        <div className="mt-12 prose prose-invert max-w-none text-muted text-base md:text-lg leading-relaxed font-medium">
          <p className="whitespace-pre-wrap">{ev.description}</p>
          <p className="mt-12 italic text-sm text-muted/60 border-t border-border/40 pt-6">
            Note: This is an official record of the event. For more information regarding our future calendar, 
            please check the main events roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
