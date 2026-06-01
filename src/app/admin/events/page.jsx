'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const deleteEvent = async (id) => {
    if (!confirm('Proceed with deletion?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <Link href="/admin" className="label hover:text-white transition-colors">← Dashboard</Link>
          <h1 className="section-title mt-4">Manage Events</h1>
        </div>
        <Link href="/admin/events/new" className="btn">
          + Create Fragment
        </Link>
      </div>

      <div className="border border-border bg-surface overflow-hidden rounded-none divide-y divide-border">
        {events.map(e => (
          <div key={e.id} className="flex flex-row items-center justify-between p-5 hover:bg-white/[0.02] transition-colors gap-4">
            {/* Left Part: Date & Title in a row */}
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider shrink-0">{new Date(e.date).toLocaleDateString()}</span>
              <div className="text-sm font-bold text-white truncate">{e.title}</div>
            </div>
            {/* Right Part: Actions */}
            <div className="flex items-center gap-6 shrink-0">
              <Link href={`/admin/events/${e.id}`} className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">
                Edit
              </Link>
              <button 
                onClick={() => deleteEvent(e.id)}
                className="text-[10px] font-bold uppercase tracking-wider text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="p-20 text-center text-sm text-muted bg-surface">
            No event fragments found. Initialize new data.
          </div>
        )}
      </div>
    </div>
  );
}
