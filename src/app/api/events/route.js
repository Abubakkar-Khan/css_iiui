import db from '@/lib/db';

export const runtime = 'nodejs';

// GET: return events and their images directly
export async function GET() {
  try {
    const eventsRes = await db.query('SELECT * FROM "Event" ORDER BY "date" DESC');
    const events = eventsRes.rows;
    
    const eventsWithImages = [];
    for (const ev of events) {
      const imagesRes = await db.query('SELECT * FROM "Image" WHERE "eventId" = $1', [ev.id]);
      eventsWithImages.push({
        ...ev,
        images: imagesRes.rows
      });
    }
    
    return new Response(JSON.stringify(eventsWithImages), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error('GET /api/events error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: expects JSON: { title, description, date, imageUrl, images }
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      title, 
      description = '', 
      date = new Date().toISOString(), 
      locationType = 'OFFLINE',
      venue = '',
      eventType = 'Workshop',
      registrationLink = '',
      imageUrl = '',
      images = []
    } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
    }

    const eventRes = await db.query(
      'INSERT INTO "Event" ("title", "description", "date", "locationType", "venue", "eventType", "registrationLink", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [title, description, new Date(date), locationType, venue, eventType, registrationLink]
    );
    const ev = eventRes.rows[0];

    const allImages = images && images.length > 0 ? images : (imageUrl ? [imageUrl] : []);
    
    const insertedImages = [];
    for (const url of allImages) {
      const imgRes = await db.query(
        'INSERT INTO "Image" ("url", "eventId", "createdAt") VALUES ($1, $2, NOW()) RETURNING *',
        [url, ev.id]
      );
      insertedImages.push(imgRes.rows[0]);
    }

    const responseData = {
      ...ev,
      images: insertedImages
    };

    console.log('[DEBUG] created event id=', ev.id);
    return new Response(JSON.stringify(responseData), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error('POST /api/events error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
