import prisma from '@/lib/prisma';
import { deleteObject } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const body = await req.json();
    const { title, details, imageUrl, date } = body;

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }

    // Clean up old Cloudinary cover photo if replaced
    if (imageUrl && existing.imageUrl && existing.imageUrl !== imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete old news cover", e.message); }
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title,
        details,
        date: date ? new Date(date) : existing.date,
        imageUrl
      }
    });

    return new Response(JSON.stringify(updated), { 
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

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }

    // Clean up cover photo in Cloudinary
    if (existing.imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete news cover", e.message); }
    }

    await prisma.news.delete({ where: { id } });
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/news/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
