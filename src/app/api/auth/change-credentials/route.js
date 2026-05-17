import prisma from '@/lib/prisma';
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

    const firstAdmin = await prisma.admin.findFirst();
    if (!firstAdmin) {
      await prisma.admin.create({
        data: {
          email: username,
          name: name || 'Admin',
          password: hashedPassword
        }
      });
    } else {
      await prisma.admin.update({
        where: { id: firstAdmin.id },
        data: {
          email: username,
          name: name || firstAdmin.name,
          password: hashedPassword
        }
      });
    }

    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("Change credentials error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
