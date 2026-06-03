import db from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const res = await db.query('SELECT * FROM "Alumni" ORDER BY "priority" ASC, "gradYear" DESC');
    return new Response(JSON.stringify(res.rows), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("GET /api/alumni error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, gradYear, company = '', role = '', imageUrl = '', linkedin = '', priority = 2 } = body;

    if (!name || !gradYear || !linkedin) {
      return new Response(JSON.stringify({ error: 'Name, Graduation Year, and LinkedIn URL are required' }), { status: 400 });
    }

    const linkedinRegex = /^https?:\/\/([a-zA-Z]{2,3}\.)?linkedin\.com\/in\/.+/i;
    if (!linkedinRegex.test(linkedin)) {
      return new Response(JSON.stringify({ error: 'Invalid LinkedIn profile URL format' }), { status: 400 });
    }

    const priorityVal = typeof priority === 'number' ? priority : Number(priority) || 2;

    const res = await db.query(
      'INSERT INTO "Alumni" ("name", "gradYear", "company", "role", "imageUrl", "linkedin", "priority", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [name, gradYear, company, role, imageUrl, linkedin, priorityVal]
    );

    return new Response(JSON.stringify(res.rows[0]), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/alumni error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
