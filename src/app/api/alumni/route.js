import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const alumni = await prisma.alumni.findMany({
      orderBy: [
        { priority: 'asc' },
        { gradYear: 'desc' }
      ]
    });
    return new Response(JSON.stringify(alumni), { 
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

    if (!name || !gradYear) {
      return new Response(JSON.stringify({ error: 'Name and Graduation Year are required' }), { status: 400 });
    }

    const item = await prisma.alumni.create({
      data: { 
        name, 
        gradYear, 
        company, 
        role, 
        imageUrl, 
        linkedin, 
        priority: typeof priority === 'number' ? priority : Number(priority) || 2 
      }
    });

    return new Response(JSON.stringify(item), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("POST /api/alumni error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
