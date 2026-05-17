import prisma from '@/lib/prisma';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const existing = await prisma.image.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }

    // Clean up photo in Cloudinary
    if (existing.url) {
      try { await deleteObject(existing.url); } 
      catch (e) { console.warn("[DEBUG] Failed to delete gallery image", e.message); }
    }

    await prisma.image.delete({ where: { id } });
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/gallery/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
