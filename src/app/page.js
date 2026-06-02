// src/app/page.js
import db from '@/lib/db'
import Hero from '@/components/Hero'
import EventsSection from '@/components/EventsSection'
import CoreTeamSection from '@/components/CoreTeamSection'
import FAQSection from '@/components/FAQSection'

export const revalidate = 60; // Incremental Static Regeneration (ISR)

export default async function Page() {
  let news = []
  let events = []
  let team = []

  try {
    const [newsRes, eventsRes, teamRes] = await Promise.all([
      db.query('SELECT * FROM "News" ORDER BY "date" DESC LIMIT 5').catch(e => { console.error("News fetch error:", e); return { rows: [] }; }),
      db.query('SELECT * FROM "Event" ORDER BY "date" DESC').catch(e => { console.error("Events fetch error:", e); return { rows: [] }; }),
      db.query('SELECT * FROM "TeamMember" ORDER BY "id" ASC').catch(e => { console.error("Team fetch error:", e); return { rows: [] }; })
    ]);

    news = newsRes.rows;
    const rawEvents = eventsRes.rows;
    if (rawEvents.length > 0) {
      const eventIds = rawEvents.map(e => e.id);
      const imagesRes = await db.query('SELECT * FROM "Image" WHERE "eventId" = ANY($1::int[])', [eventIds]).catch(e => { console.error("Images fetch error:", e); return { rows: [] }; });
      const images = imagesRes.rows;
      const imagesByEventId = {};
      images.forEach(img => {
        if (!imagesByEventId[img.eventId]) imagesByEventId[img.eventId] = [];
        imagesByEventId[img.eventId].push(img);
      });
      events = rawEvents.map(ev => ({
        ...ev,
        images: imagesByEventId[ev.id] || []
      }));
    }
    team = teamRes.rows;
  } catch (err) {
    console.error("Error pre-fetching page data:", err);
  }

  return (
    <>
      <Hero initialNews={news} />
      <EventsSection initialEvents={events} />
      <CoreTeamSection initialTeam={team} />
      <FAQSection />
    </>
  )
}