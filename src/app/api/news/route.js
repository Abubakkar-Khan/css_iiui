import db from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const res = await db.query('SELECT * FROM "News" ORDER BY "date" DESC');
    return new Response(JSON.stringify(res.rows), { 
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

    const res = await db.query(
      'INSERT INTO "News" ("title", "details", "imageUrl", "date", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [title, details, imageUrl, new Date(date)]
    );

    return new Response(JSON.stringify(res.rows[0]), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
