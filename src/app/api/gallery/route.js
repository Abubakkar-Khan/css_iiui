import db from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const res = await db.query(`
      SELECT i.*, e.title AS "eventTitle"
      FROM "Image" i
      LEFT JOIN "Event" e ON i."eventId" = e.id
      ORDER BY i.id DESC
    `);

    const formatted = res.rows.map(row => ({
      id: row.id,
      url: row.url,
      caption: row.caption,
      eventId: row.eventId,
      event: row.eventTitle ? { title: row.eventTitle } : null
    }));

    return new Response(JSON.stringify(formatted), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, caption = '', eventId = null } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: 'Image URL is required' }), { status: 400 });
    }

    const parsedEventId = eventId ? Number(eventId) : null;
    const dbEventId = Number.isInteger(parsedEventId) ? parsedEventId : null;

    const insertRes = await db.query(
      'INSERT INTO "Image" ("url", "caption", "eventId", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *',
      [url, caption, dbEventId]
    );

    const inserted = insertRes.rows[0];

    // Fetch the event title if exists to match schema formatting
    let eventTitle = null;
    if (dbEventId) {
      const eRes = await db.query('SELECT "title" FROM "Event" WHERE "id" = $1', [dbEventId]);
      if (eRes.rows.length > 0) {
        eventTitle = eRes.rows[0].title;
      }
    }

    const formatted = {
      ...inserted,
      event: eventTitle ? { title: eventTitle } : null
    };

    return new Response(JSON.stringify(formatted), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
