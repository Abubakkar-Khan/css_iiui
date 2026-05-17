import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { id: 'desc' },
      include: {
        event: {
          select: { title: true }
        }
      }
    });
    return new Response(JSON.stringify(images), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, caption = '', eventId = null } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: 'Image URL is required' }), { status: 400 });
    }

    const parsedEventId = eventId ? Number(eventId) : null;

    const img = await prisma.image.create({
      data: {
        url,
        caption,
        eventId: Number.isInteger(parsedEventId) ? parsedEventId : null
      },
      include: {
        event: {
          select: { title: true }
        }
      }
    });

    return new Response(JSON.stringify(img), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
