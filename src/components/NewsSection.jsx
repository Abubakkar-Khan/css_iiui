// src/components/NewsSection.jsx
'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { optimizeImageUrl } from '@/lib/images'

export default function NewsSection() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data.slice(0, 3)) // Show top 3 recent news articles
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || news.length === 0) return null

  return (
    <section className="section-pad section">
      <div className="section-header text-center">
        <span className="label justify-center">Recent Updates</span>
        <h2 className="section-title mt-4">Society News</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {news.map(item => (
          <article key={item.id} className="card p-0 overflow-hidden bg-surface flex flex-col h-full border border-border hover:border-white/20 transition-all duration-300">
            {item.imageUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-black/20 relative">
                <Image
                  src={optimizeImageUrl(item.imageUrl, 500, 280)}
                  alt={item.title}
                  width={500}
                  height={280}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <span className="label text-[9px] mb-2">
                {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
              <h3 className="text-base font-bold text-white uppercase tracking-tight mb-3 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed line-clamp-4 font-medium">
                {item.details}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
