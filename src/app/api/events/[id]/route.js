import db from '@/lib/db';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

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
}
