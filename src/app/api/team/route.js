import db from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const res = await db.query('SELECT * FROM "TeamMember" ORDER BY "id" ASC');
    return new Response(JSON.stringify(res.rows), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("GET /api/team error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, designation, details = '', imageUrl = '', instagram = '', linkedin = '', facebook = '' } = body;

    if (!name || !designation) {
      return new Response(JSON.stringify({ error: 'Name and Designation are required' }), { status: 400 });
    }

    if (instagram) {
      const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/.+/i;
      if (!instagramRegex.test(instagram)) {
        return new Response(JSON.stringify({ error: 'Invalid Instagram URL format' }), { status: 400 });
      }
    }
    if (linkedin) {
      const linkedinRegex = /^https?:\/\/([a-zA-Z]{2,3}\.)?linkedin\.com\/in\/.+/i;
      if (!linkedinRegex.test(linkedin)) {
        return new Response(JSON.stringify({ error: 'Invalid LinkedIn URL format' }), { status: 400 });
      }
    }
    if (facebook) {
      const facebookRegex = /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i;
      if (!facebookRegex.test(facebook)) {
        return new Response(JSON.stringify({ error: 'Invalid Facebook URL format' }), { status: 400 });
      }
    }

    const res = await db.query(
      'INSERT INTO "TeamMember" ("name", "designation", "details", "imageUrl", "instagram", "linkedin", "facebook", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [name, designation, details, imageUrl, instagram, linkedin, facebook]
    );

    return new Response(JSON.stringify(res.rows[0]), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/team error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
