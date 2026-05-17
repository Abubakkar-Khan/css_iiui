// src/app/gallery/page.jsx
'use client'
import { useEffect, useState } from 'react'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="section-pad section">
      <div className="max-w-2xl">
        <span className="label">Moments</span>
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
            <figure key={img.id} className="card p-0 group overflow-hidden relative aspect-square bg-black">
              <img
                src={img.url}
                alt={img.caption || 'Gallery Image'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {img.event && (
                  <span className="text-[8px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
                    Event: {img.event.title}
                  </span>
                )}
                <span className="label text-white text-[10px]">{img.caption || 'Society Event'}</span>
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
    </div>
  )
}