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
    const { name, designation, details, imageUrl, instagram, linkedin, facebook } = body;

    if (instagram) {
      const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/.+/i;
      if (!instagramRegex.test(instagram)) {
        return new Response(JSON.stringify({ error: 'Invalid Instagram URL format' }), { status: 400 });
      }
    }
    if (linkedin) {
      const linkedinRegex = /^https?:\/\/([a-zA-Z]{2,3}\.)?linkedin\.com\/in\/.+/i;
      if (!linkedinRegex.test(linkedin)) {
        return new Response(JSON.stringify({ error: 'Invalid LinkedIn URL format' }), { status: 400 });
      }
    }
    if (facebook) {
      const facebookRegex = /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i;
      if (!facebookRegex.test(facebook)) {
        return new Response(JSON.stringify({ error: 'Invalid Facebook URL format' }), { status: 400 });
      }
    }

    const existingRes = await db.query('SELECT * FROM "TeamMember" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up old Cloudinary headshot if a new one is uploaded
    if (imageUrl && existing.imageUrl && existing.imageUrl !== imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete old headshot", e.message); }
    }

    const updatedRes = await db.query(
      'UPDATE "TeamMember" SET "name" = $1, "designation" = $2, "details" = $3, "imageUrl" = $4, "instagram" = $5, "linkedin" = $6, "facebook" = $7, "updatedAt" = NOW() WHERE "id" = $8 RETURNING *',
      [
        name !== undefined ? name : existing.name,
        designation !== undefined ? designation : existing.designation,
        details !== undefined ? details : existing.details,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        instagram !== undefined ? instagram : existing.instagram,
        linkedin !== undefined ? linkedin : existing.linkedin,
        facebook !== undefined ? facebook : existing.facebook,
        id
      ]
    );

    return new Response(JSON.stringify(updatedRes.rows[0]), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("PUT /api/team/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const existingRes = await db.query('SELECT * FROM "TeamMember" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up photo in Cloudinary
    if (existing.imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete headshot", e.message); }
    }

    await db.query('DELETE FROM "TeamMember" WHERE "id" = $1', [id]);
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/team/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
