import db from '@/lib/db';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const res = await db.query('SELECT * FROM "News" WHERE "id" = $1', [id]);
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }

    return new Response(JSON.stringify(res.rows[0]), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("GET /api/news/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const body = await req.json();
    const { title, details, imageUrl, date } = body;

    const existingRes = await db.query('SELECT * FROM "News" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up old Cloudinary cover photo if replaced
    if (imageUrl && existing.imageUrl && existing.imageUrl !== imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete old news cover", e.message); }
    }

    const updatedRes = await db.query(
      'UPDATE "News" SET "title" = $1, "details" = $2, "date" = $3, "imageUrl" = $4, "updatedAt" = NOW() WHERE "id" = $5 RETURNING *',
      [
        title !== undefined ? title : existing.title,
        details !== undefined ? details : existing.details,
        date ? new Date(date) : existing.date,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        id
      ]
    );

    return new Response(JSON.stringify(updatedRes.rows[0]), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("PUT /api/news/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const existingRes = await db.query('SELECT * FROM "News" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up cover photo in Cloudinary
    if (existing.imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete news cover", e.message); }
    }

    await db.query('DELETE FROM "News" WHERE "id" = $1', [id]);
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/news/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
