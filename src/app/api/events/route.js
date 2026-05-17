import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

// GET: return events and their images directly
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: { images: true },
    });
    return new Response(JSON.stringify(events), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/events error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: expects JSON: { title, description, date, imageUrl }
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description = '', date = new Date().toISOString(), imageUrl = '' } = body;

    if (!title) return new Response(JSON.stringify({ error: 'title required' }), { status: 400 });

    const ev = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        images: {
          create: imageUrl ? [{ url: imageUrl }] : []
        }
      },
      include: { images: true }
    });

    console.log('[DEBUG] created event id=', ev.id);
    return new Response(JSON.stringify(ev), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('POST /api/events error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
