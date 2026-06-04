'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function EventSlideshow({ images = [], title = '' }) {
  const displayedImages = images.slice(0, 3)
  const [idx, setIdx] = useState(0)

  if (!displayedImages || displayedImages.length === 0) return null

  const go = (dir) => {
    setIdx((v) => (v + dir + displayedImages.length) % displayedImages.length)
  }

  return (
    <div className="relative group overflow-hidden border border-border bg-black aspect-video w-full">
      {/* Navigation Buttons - Left & Right (Only if > 1 image) */}
      {displayedImages.length > 1 && (
        <>
          <button 
            onClick={() => go(-1)}
            className="slider-nav left-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 border border-border text-white transition-all hover:bg-white hover:text-black"
            aria-label="Prev Image"
          >
            ‹
          </button>
          <button 
            onClick={() => go(1)}
            className="slider-nav right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 border border-border text-white transition-all hover:bg-white hover:text-black"
            aria-label="Next Image"
          >
            ›
          </button>
        </>
      )}

      {/* Image Slides */}
      <div className="relative w-full h-full">
        {displayedImages.map((item, i) => {
          const imgUrl = typeof item === 'string' ? item : item.url;
          const caption = typeof item === 'object' ? item.caption : '';

          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ 
                opacity: i === idx ? 1 : 0,
                zIndex: i === idx ? 10 : 0
              }}
            >
              <Image
                src={imgUrl}
                alt={`${title} - Slide ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority={i === 0}
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {caption && i === idx && (
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/85 border border-white/10 px-4.5 py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-100 max-w-max backdrop-blur-sm">
                  {caption}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Dots Indicator */}
      {displayedImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayedImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === idx ? 'bg-white w-3' : 'bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

