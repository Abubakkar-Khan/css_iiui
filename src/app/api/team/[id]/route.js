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
    const { name, designation, details, imageUrl, instagram, linkedin, facebook } = body;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }

    // Clean up old Cloudinary headshot if a new one is uploaded
    if (imageUrl && existing.imageUrl && existing.imageUrl !== imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete old headshot", e.message); }
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: { name, designation, details, imageUrl, instagram, linkedin, facebook }
    });

    return new Response(JSON.stringify(updated), { 
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

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }

    // Clean up photo in Cloudinary
    if (existing.imageUrl) {
      try { await deleteObject(existing.imageUrl); } 
      catch (e) { console.warn("[DEBUG] Failed to delete headshot", e.message); }
    }

    await prisma.teamMember.delete({ where: { id } });
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/team/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
