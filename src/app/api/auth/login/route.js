import db from '@/lib/db';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    }

    // Find admin by email
    const res = await db.query('SELECT * FROM "Admin" WHERE "email" = $1', [email]);
    
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    const admin = res.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    return new Response(JSON.stringify({ ok: true, name: admin.name }), {
      status: 200,
      headers: {
        'Set-Cookie': `admin=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
