import db from '@/lib/db';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const body = await req.json();
    const { name, gradYear, company, role, imageUrl, linkedin, priority } = body;

    if (linkedin !== undefined) {
      if (!linkedin) {
        return new Response(JSON.stringify({ error: 'LinkedIn profile URL cannot be empty' }), { status: 400 });
      }
      const linkedinRegex = /^https?:\/\/([a-zA-Z]{2,3}\.)?linkedin\.com\/in\/.+/i;
      if (!linkedinRegex.test(linkedin)) {
        return new Response(JSON.stringify({ error: 'Invalid LinkedIn profile URL format' }), { status: 400 });
      }
    }

    const existingRes = await db.query('SELECT * FROM "Alumni" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up old Cloudinary portrait if a new one is uploaded
    if (imageUrl && existing.imageUrl && existing.imageUrl !== imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete old alumni picture", e.message); }
    }

    const priorityVal = typeof priority === 'number' ? priority : (priority !== undefined ? Number(priority) || 2 : existing.priority);

    const updatedRes = await db.query(
      'UPDATE "Alumni" SET "name" = $1, "gradYear" = $2, "company" = $3, "role" = $4, "imageUrl" = $5, "linkedin" = $6, "priority" = $7, "updatedAt" = NOW() WHERE "id" = $8 RETURNING *',
      [
        name !== undefined ? name : existing.name,
        gradYear !== undefined ? gradYear : existing.gradYear,
        company !== undefined ? company : existing.company,
        role !== undefined ? role : existing.role,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        linkedin !== undefined ? linkedin : existing.linkedin,
        priorityVal,
        id
      ]
    );

    return new Response(JSON.stringify(updatedRes.rows[0]), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("PUT /api/alumni/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const existingRes = await db.query('SELECT * FROM "Alumni" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up photo in Cloudinary
    if (existing.imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete alumni picture", e.message); }
    }

    await db.query('DELETE FROM "Alumni" WHERE "id" = $1', [id]);
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/alumni/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
