import db from '@/lib/db';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const isLogged = cookie.split(';').map(s => s.trim()).includes('admin=1');
    if (!isLogged) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { username, name, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and Password are required' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkRes = await db.query('SELECT * FROM "Admin" LIMIT 1');
    if (checkRes.rows.length === 0) {
      await db.query(
        'INSERT INTO "Admin" ("email", "name", "password", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
        [username, name || 'Admin', hashedPassword]
      );
    } else {
      const firstAdmin = checkRes.rows[0];
      await db.query(
        'UPDATE "Admin" SET "email" = $1, "name" = $2, "password" = $3, "updatedAt" = NOW() WHERE "id" = $4',
        [username, name || firstAdmin.name, hashedPassword, firstAdmin.id]
      );
    }

    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("Change credentials error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
