// src/app/api/auth/me/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req) {
  // 1. Check legacy/custom cookie
  const cookie = req.headers.get('cookie') || '';
  let admin = cookie.split(';').map(s => s.trim()).includes('admin=1');

  // 2. Check NextAuth Google session fallback
  if (!admin) {
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const allowedEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        if (session.user.email.toLowerCase() === allowedEmail.toLowerCase()) {
          admin = true;
        }
      }
    } catch (e) {
      console.error("[AuthMe] NextAuth session lookup failed:", e.message);
    }
  }

  return new Response(JSON.stringify({ admin }), { 
    headers: { 'Content-Type': 'application/json' } 
  });
}
