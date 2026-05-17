'use client'
import { useEffect, useState } from 'react'

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
    <section className="section py-16 md:py-32">
      <div className="text-center mb-16">
        <span className="label justify-center">Recent Updates</span>
        <h2 className="section-title mt-4">Society News</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {news.map(item => (
          <article key={item.id} className="card p-0 overflow-hidden bg-black flex flex-col h-full border border-border hover:border-white/20 transition-all duration-300">
            {item.imageUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-border">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
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
              <p className="text-xs text-muted leading-relaxed line-clamp-4">
                {item.details}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
