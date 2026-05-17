import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' }
    });
    return new Response(JSON.stringify(news), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("GET /api/news error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, details, imageUrl = '', date = new Date().toISOString() } = body;

    if (!title || !details) {
      return new Response(JSON.stringify({ error: 'Title and details are required' }), { status: 400 });
    }

    const item = await prisma.news.create({
      data: {
        title,
        details,
        date: new Date(date),
        imageUrl
      }
    });

    return new Response(JSON.stringify(item), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
