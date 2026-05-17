import { putObject, randomImageName } from '@/lib/cloudinary';
import sharp from 'sharp';

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

    let processedBuffer = buffer;
    let processedContentType = file.type;
    let processedKeySuffix = file.type.split('/')[1] || 'jpg';

    // Optimize images if the uploaded file is indeed an image
    if (file.type && file.type.startsWith('image/')) {
      try {
        processedBuffer = await sharp(buffer)
          .rotate() // Auto-orient based on EXIF data (e.g. from mobile cameras)
          .resize({
            width: 1920,
            height: 1920,
            fit: 'inside',
            withoutEnlargement: true // Avoid scaling up smaller images
          })
          .webp({ quality: 80, effort: 4 }) // Convert to WebP with 80% compression quality
          .toBuffer();

        processedContentType = 'image/webp';
        processedKeySuffix = 'webp';

        console.log(
          `[Image Compression] Compressed '${file.name}' (${file.type}) to WebP. Size: ${(buffer.length / 1024).toFixed(1)} KB -> ${(processedBuffer.length / 1024).toFixed(1)} KB (Savings: ${(((buffer.length - processedBuffer.length) / buffer.length) * 100).toFixed(1)}%)`
        );
      } catch (sharpError) {
        console.error('[Image Compression] sharp processing failed, using original file instead:', sharpError);
      }
    }

    const key = randomImageName() + '.' + processedKeySuffix;
    const result = await putObject({
      key,
      body: processedBuffer,
      contentType: processedContentType
    });

    // Return both secure_url as `url` and `key` for drop-in compatibility
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
