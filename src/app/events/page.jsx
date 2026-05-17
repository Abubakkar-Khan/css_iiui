// src/app/events/page.jsx
'use client'
import { useEffect, useState } from 'react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="section py-12 md:py-20">
      <div className="max-w-2xl">
        <span className="label">Our Calendar</span>
        <h1 className="section-title mt-2">Events & Workshops</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          Explore technical workshops, guest lectures, and programming hackathons organized by the Computer Science Society at IIUI.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Loading Events...
        </div>
      ) : (
        <div className="mt-16">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-8">All Scheduled Events</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
          {events.length === 0 && (
            <div className="border border-border p-20 text-center text-sm text-muted bg-surface mt-8">
              No events scheduled yet. Check back soon!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventCard({ event }) {
  const imageUrl = event.images?.[0]?.url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop';
  
  return (
    <article className="card p-0 flex flex-col group overflow-hidden h-full">
      <div className="overflow-hidden aspect-video border-b border-border">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="label text-[9px]">{new Date(event.date).toLocaleDateString()}</span>
            <span className="text-[8px] font-mono text-muted bg-border px-2 py-0.5 uppercase">{event.eventType || 'Workshop'}</span>
          </div>
          <h3 className="text-base font-bold text-white mb-3">
            {event.title}
          </h3>
          <div className="text-xs text-muted leading-relaxed line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
        <div className="pt-4 border-t border-border/40">
          <a href={`/events/${event.id}`} className="btn-ghost w-full text-[9px]">
            View Event Details →
          </a>
        </div>
      </div>
    </article>
  )
}
