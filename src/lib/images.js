// src/lib/images.js

/**
 * Optimizes an image URL from Cloudinary or Unsplash.
 * Strips version strings/cache busters and adds optimization params.
 * 
 * @param {string} url - The original image URL
 * @param {number} [width] - Desired width
 * @param {number} [height] - Desired height
 * @returns {string} The optimized image URL
 */
export function optimizeImageUrl(url, width, height) {
  if (!url) return '';

  try {
    // 1. Remove version/cache busters (e.g., ?v=123 or ?v=456)
    // We strip query parameters except for those we need for unsplash
    let cleanUrl = url;
    if (url.includes('?')) {
      const parts = url.split('?');
      // If it's not Unsplash, strip all query params.
      // If it is Unsplash, we'll parse and rebuild them.
      if (!url.includes('images.unsplash.com')) {
        cleanUrl = parts[0];
      }
    }

    // 2. Unsplash Optimization
    if (cleanUrl.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      // Remove cache buster version if any
      urlObj.searchParams.delete('v');
      
      // Add standard optimization query params
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', '80');
      
      if (width) {
        urlObj.searchParams.set('w', width.toString());
      }
      if (height) {
        urlObj.searchParams.set('h', height.toString());
      }
      
      return urlObj.toString();
    }

    // 3. Cloudinary Optimization
    if (cleanUrl.includes('res.cloudinary.com')) {
      // Find the location of "/upload/" in the URL
      const uploadIndex = cleanUrl.indexOf('/upload/');
      if (uploadIndex !== -1) {
        const insertPosition = uploadIndex + '/upload/'.length;
        const prefix = cleanUrl.slice(0, insertPosition);
        const suffix = cleanUrl.slice(insertPosition);
        
        // Remove existing transformation segments if any (e.g., if there's f_auto,q_auto already)
        // A typical URL is .../upload/v12345/path/to/image
        // Or .../upload/w_300,h_200/v12345/path/to/image
        // Let's strip any existing transformation segment before v[0-9]+ or before the public id
        // For simplicity, if suffix starts with a known transformation, we can clean it, 
        // but normally user uploads won't have it.
        // Let's create the optimization string:
        let transformation = 'f_auto,q_auto';
        if (width && height) {
          transformation += `,c_fill,g_auto,w_${width},h_${height}`;
        } else if (width) {
          transformation += `,w_${width}`;
        }
        
        return `${prefix}${transformation}/${suffix}`;
      }
    }

    return cleanUrl;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return url;
  }
}
