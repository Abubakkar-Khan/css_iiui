import db from '@/lib/db';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const existingRes = await db.query('SELECT * FROM "Image" WHERE "id" = $1', [id]);
    if (existingRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    const existing = existingRes.rows[0];

    // Clean up photo in Cloudinary
    if (existing.url) {
      try { await deleteObject(existing.url); } 
      catch (e) { console.warn("[DEBUG] Failed to delete gallery image", e.message); }
    }

    await db.query('DELETE FROM "Image" WHERE "id" = $1', [id]);
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/gallery/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
