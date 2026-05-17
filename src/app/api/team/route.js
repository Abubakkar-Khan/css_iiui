import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { id: 'asc' }
    });
    return new Response(JSON.stringify(members), { 
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

    const member = await prisma.teamMember.create({
      data: { name, designation, details, imageUrl, instagram, linkedin, facebook }
    });

    return new Response(JSON.stringify(member), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/team error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
