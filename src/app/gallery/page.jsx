// src/app/gallery/page.jsx
'use client'
import { useEffect, useState } from 'react'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename || 'gallery-image.jpg'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Failed to download image", err)
      // Fallback: Open in new tab
      window.open(url, '_blank')
    }
  }

  return (
    <div className="section-pad section">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="label justify-center">Memories</span>
        <h1 className="section-title mt-2">Society Gallery</h1>
        <p className="mt-4 text-muted text-base leading-relaxed">
          A visual showcase of memories, hackathons, and guest speaker sessions at the Computer Science Society.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm font-mono text-muted uppercase animate-pulse">
          Loading Gallery...
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <figure 
              key={img.id} 
              className="card p-0 group overflow-hidden relative aspect-square bg-black cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.url}
                alt={img.caption || 'Gallery Image'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-start h-full">
                {img.event && (
                  <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-1">
                    Event: {img.event.title}
                  </span>
                )}
                <span className="label text-white text-xs mb-3">{img.caption || 'Society Event'}</span>
                
                {/* Cross-origin Secure Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(img.url, `css-iiui-${img.id}.jpg`);
                  }}
                  className="inline-flex items-center gap-2 text-xs tracking-wider font-mono uppercase bg-white text-black px-4 py-2 hover:bg-white/90 transition-colors font-bold cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </figcaption>
            </figure>
          ))}
          {images.length === 0 && (
            <div className="col-span-full border border-border p-20 text-center text-sm text-muted bg-surface">
              No gallery images found yet. Add them in the Admin Dashboard!
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-zinc-400 transition-colors focus:outline-none cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>

          {/* Modal Container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center gap-4 pointer-events-auto"
            onClick={e => e.stopPropagation()} // Prevent close on image/content click
          >
            {/* Image in its original aspect ratio */}
            <img 
              src={selectedImage.url} 
              alt={selectedImage.caption || 'Full Gallery Image'} 
              className="max-h-[75vh] max-w-full object-contain border border-white/10"
            />
            
            {/* Info and Download */}
            <div className="w-full flex items-center justify-between gap-4 mt-2 px-2">
              <div className="text-left">
                {selectedImage.event && (
                  <span className="text-xs font-mono text-white/50 uppercase tracking-wider block">
                    Event: {selectedImage.event.title}
                  </span>
                )}
                <span className="text-sm text-white font-semibold">{selectedImage.caption || 'Society Event'}</span>
              </div>

              <button
                onClick={() => handleDownload(selectedImage.url, `css-iiui-${selectedImage.id}.jpg`)}
                className="inline-flex items-center gap-2 text-xs tracking-wider font-mono uppercase bg-white text-black px-4 py-2 hover:bg-white/90 transition-colors font-bold cursor-pointer shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}