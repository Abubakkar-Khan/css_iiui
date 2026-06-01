import { putObject, randomImageName } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileSuffix = file.type.split('/')[1] || 'jpg';
    const key = randomImageName() + '.' + fileSuffix;

    // Direct Cloudinary upload with the original buffer - completely removing sharp and compression!
    const result = await putObject({
      key,
      body: buffer,
      contentType: file.type
    });

    return new Response(JSON.stringify({ 
      url: result.secure_url, 
      key: result.secure_url 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
