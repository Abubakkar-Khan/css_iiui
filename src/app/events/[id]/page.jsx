// src/app/events/[id]/page.jsx
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function EventPage({ params }) {
  const id = Number(params.id);
  // Using mock data fallback if DB entry doesn't exist for demo
  const mockEvents = {
    1: { title: 'IT Orientation 2024', date: 'Aug 16, 2024', img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600', description: 'Welcoming the new batch to the world of Computer Science.' },
    2: { title: 'Next.js Workshop', date: 'Sep 02, 2024', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600', description: 'Deep dive into fullstack development with Next.js.' },
  }

  const ev = (await prisma.event.findUnique({
    where: { id },
    include: { images: true },
  })) || mockEvents[id];

  if (!ev) return (
    <div className="section py-20 text-center">
      <h1 className="section-title">Fragment Not Found</h1>
      <Link href="/events" className="btn mt-8">Back to Events</Link>
    </div>
  );

  return (
    <div className="section py-12 md:py-20">
      <Link href="/events" className="label hover:text-white transition-colors">← Back to Events</Link>
      
      <div className="mt-8 relative aspect-video overflow-hidden border border-border">
        <img
          src={ev.images?.[0]?.url || ev.img}
          alt={ev.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-12 max-w-3xl">
        <span className="label">{new Date(ev.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 uppercase tracking-tight">{ev.title}</h1>
        
        <div className="mt-12 prose prose-invert max-w-none text-muted leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: ev.description }} />
          <p className="mt-8 italic">
            Note: This is a historical record of the event. For more information regarding our future calendar, 
            please check the main events roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
