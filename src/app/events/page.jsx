// src/app/events/page.jsx
'use client'
import { useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Collect unique event types for the filter bar
  const eventTypes = ['All', ...new Set(events.map(e => e.eventType || 'Workshop'))]

  const filtered = filter === 'All'
    ? events
    : events.filter(e => (e.eventType || 'Workshop') === filter)

  return (
    <div className="section-pad section">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="label justify-center">Our Calendar</span>
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
          {/* Filter Bar */}
          {eventTypes.length > 2 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`text-[9px] font-mono uppercase tracking-widest px-4 py-2 border transition-all duration-200 ${
                    filter === type
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-muted border-border hover:border-white/40 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          <h2 className="text-xl font-bold uppercase tracking-tight mb-8">
            {filter === 'All' ? 'All Scheduled Events' : filter}
          </h2>

          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="border border-border p-20 text-center text-sm text-muted bg-surface mt-8">
              {filter === 'All'
                ? 'No events scheduled yet. Check back soon!'
                : `No ${filter} events found.`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
