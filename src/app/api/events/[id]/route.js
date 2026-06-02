import db from '@/lib/db';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

// GET: Fetch a single event and its images
export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

  try {
    const evRes = await db.query('SELECT * FROM "Event" WHERE "id" = $1', [id]);
    if (evRes.rows.length === 0) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    const ev = evRes.rows[0];

    const imgRes = await db.query('SELECT * FROM "Image" WHERE "eventId" = $1', [id]);
    ev.images = imgRes.rows;

    return new Response(JSON.stringify(ev), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/events/[id] error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// PUT: Update a single event and its images
export async function PUT(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

  try {
    const body = await req.json();
    const { 
      title, 
      description = '', 
      locationType = 'OFFLINE',
      venue = '',
      eventType = 'Workshop',
      registrationLink = '',
      images = []
    } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
    }

    const eventRes = await db.query(
      'UPDATE "Event" SET "title" = $1, "description" = $2, "locationType" = $3, "venue" = $4, "eventType" = $5, "registrationLink" = $6, "updatedAt" = NOW() WHERE "id" = $7 RETURNING *',
      [title, description, locationType, venue, eventType, registrationLink, id]
    );

    if (eventRes.rows.length === 0) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    const ev = eventRes.rows[0];

    // For simplicity, delete old DB image rows for this event, and insert new ones
    await db.query('DELETE FROM "Image" WHERE "eventId" = $1', [id]);

    const insertedImages = [];
    if (images && images.length > 0) {
      for (const img of images) {
        const url = typeof img === 'string' ? img : img.url;
        const caption = typeof img === 'object' ? (img.caption || '') : '';
        const imgRes = await db.query(
          'INSERT INTO "Image" ("url", "caption", "eventId", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *',
          [url, caption, id]
        );
        insertedImages.push(imgRes.rows[0]);
      }
    }

    ev.images = insertedImages;
    return new Response(JSON.stringify(ev), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('PUT /api/events/[id] error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE: Delete a single event
export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

  try {
    const evRes = await db.query('SELECT * FROM "Event" WHERE "id" = $1', [id]);
    if (evRes.rows.length === 0) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    const imgRes = await db.query('SELECT * FROM "Image" WHERE "eventId" = $1', [id]);
    const images = imgRes.rows;

    // delete Cloudinary objects first
    for (const img of images) {
      try { await deleteObject(img.url); }
      catch (err) { console.warn('[DEBUG] Cloudinary delete failed', img.url, err.message); }
    }

    // Delete images cascade then the event
    await db.query('DELETE FROM "Image" WHERE "eventId" = $1', [id]);
    await db.query('DELETE FROM "Event" WHERE "id" = $1', [id]);

    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error('DELETE /api/events/[id] error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
