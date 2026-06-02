// src/app/gallery/page.jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { optimizeImageUrl } from '@/lib/images'

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

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

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
      window.open(url, '_blank')
    }
  }

  return (
    <div className="section-pad section">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="label justify-center">Memories</span>
        <h1 className="section-title mt-2">Society Gallery</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          A visual showcase of memories, hackathons, and guest speaker sessions at the Computer Science Society.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Loading Gallery...
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <figure 
              key={img.id} 
              className="card p-0 group overflow-hidden relative aspect-square bg-surface border border-border cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={optimizeImageUrl(img.url, 500, 500)}
                alt={img.caption || 'Gallery Image'}
                width={500}
                height={500}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-start h-full">
                {img.event && (
                  <span className="text-[8px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                    Event: {img.event.title}
                  </span>
                )}
                <span className="label text-white text-[10px] mb-3">{img.caption || 'Society Event'}</span>
                
                {/* Cross-origin Secure Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(img.url, `css-iiui-${img.id}.jpg`);
                  }}
                  className="inline-flex items-center gap-2 text-[9px] tracking-wider font-mono uppercase bg-white text-black px-3 py-1.5 hover:bg-white/90 transition-colors font-bold cursor-pointer"
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fade-in-up"
          onClick={() => setSelectedImage(null)}
        >
          {/* Modal Container */}
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col gap-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-muted hover:text-white text-xs font-mono uppercase tracking-wider"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              [ Close ]
            </button>

            {/* Image display */}
            <div className="flex-1 flex items-center justify-center overflow-hidden h-[50vh] md:h-[60vh] mt-6 relative w-full bg-black/20 border border-[var(--border)]">
              <Image 
                src={optimizeImageUrl(selectedImage.url, 1200)} 
                alt={selectedImage.caption || 'Full view'}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
              <div>
                {selectedImage.event && (
                  <span className="text-[8px] font-mono text-muted uppercase tracking-widest block mb-1">
                    Event: {selectedImage.event.title}
                  </span>
                )}
                <h3 className="text-xs font-black uppercase tracking-tight text-white">
                  {selectedImage.caption || 'Society Event Capture'}
                </h3>
              </div>

              <div className="flex gap-3">
                {selectedImage.event && selectedImage.eventId && (
                  <Link
                    href={`/events/${selectedImage.eventId}`}
                    className="btn text-[9px] px-4 py-2"
                  >
                    View Event →
                  </Link>
                )}
                <button
                  onClick={() => handleDownload(selectedImage.url, `css-iiui-${selectedImage.id}.jpg`)}
                  className="btn-ghost text-[9px] px-4 py-2"
                >
                  Download Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}