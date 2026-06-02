// src/lib/images.js

/**
 * Optimizes Unsplash and Cloudinary image URLs by injecting compression and sizing parameters directly.
 * Ensures the exact same URL pattern is used for the same assets and dimensions so browsers cache them effectively.
 * 
 * @param {string} url - Original image URL
 * @param {number} width - Target width
 * @param {number} [height] - Target height (optional)
 * @returns {string} Optimized URL
 */
export function optimizeImageUrl(url, width = 800, height = null) {
  if (!url || typeof url !== 'string') return url;

  // Remove any preexisting version query parameters or cache busters to enable uniform CDN caching
  let cleanUrl = url.split('?')[0];

  // 1. Cloudinary URLs
  if (cleanUrl.includes('res.cloudinary.com')) {
    const parts = cleanUrl.split('/upload/');
    if (parts.length === 2) {
      let transformation = `f_auto,q_auto,w_${width}`;
      if (height) {
        transformation += `,h_${height},c_fill`;
      }
      return `${parts[0]}/upload/${transformation}/${parts[1]}`;
    }
  }

  // 2. Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url);
      u.searchParams.set('auto', 'format');
      u.searchParams.set('q', '80');
      u.searchParams.set('w', width.toString());
      if (height) {
        u.searchParams.set('h', height.toString());
        u.searchParams.set('fit', 'crop');
      }
      return u.toString();
    } catch {
      return url;
    }
  }

  return url;
}
