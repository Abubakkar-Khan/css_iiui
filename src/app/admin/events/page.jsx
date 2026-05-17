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

      <div className="border border-border bg-surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-[#0d0d0d]">
              <th className="p-5 label">Status / Date</th>
              <th className="p-5 label">Fragment Title</th>
              <th className="p-5 label text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                <td className="p-5 text-xs text-muted font-mono">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-5 text-sm font-bold text-white">{e.title}</td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-6">
                    <Link href={`/admin/events/${e.id}`} className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors">
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteEvent(e.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="3" className="p-20 text-center text-sm text-muted">
                  No event fragments found. Initialize new data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
