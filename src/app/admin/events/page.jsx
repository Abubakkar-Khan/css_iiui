'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const deleteEvent = async (id) => {
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

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((e, index) => (
          <EventCard
            key={e.id}
            event={e}
            index={index}
            onEdit={(event) => router.push(`/admin/events/${event.id}`)}
            onDelete={deleteEvent}
          />
        ))}
      </div>

      {events.length === 0 && (
        <div className="border border-border p-20 text-center text-sm text-muted bg-surface mt-8">
          No event fragments found. Initialize new data.
        </div>
      )}
    </div>
  );
}
