import prisma from '@/lib/prisma';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

  const ev = await prisma.event.findUnique({ where: { id }, include: { images: true } });
  if (!ev) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  // delete Cloudinary objects first
  for (const img of ev.images) {
    try { await deleteObject(img.url); }
    catch (err) { console.warn('[DEBUG] Cloudinary delete failed', img.url, err.message); }
  }

  await prisma.event.delete({ where: { id } });
  return new Response(JSON.stringify({ ok: true }));
}
