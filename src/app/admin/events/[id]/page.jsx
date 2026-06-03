// src/app/admin/events/[id]/page.jsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const EventEditor = dynamic(() => import("@/components/admin/EventEditor"), {
  ssr: false,
});

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    fetch(`/api/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load event:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (payload) => {
    setSaving(true);
    const finalImages = [];
    
    // Upload files in mediaList
    for (const item of payload.mediaList) {
      if (item.file) {
        const formData = new FormData();
        formData.append('file', item.file);

        try {
          const res = await fetch('/api/upload-url', {
            method: 'POST',
            body: formData,
          });
          
          if (res.ok) {
            const data = await res.json();
            finalImages.push({ url: data.url, caption: item.caption });
          } else {
            console.error(`Failed to upload ${item.file.name}`);
          }
        } catch (err) {
          console.error(`Error uploading ${item.file.name}`, err);
        }
      } else {
        // Re-use already uploaded image
        finalImages.push({ url: item.url, caption: item.caption });
      }
    }

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          title: payload.title, 
          description: payload.description, 
          locationType: payload.locationType,
          venue: payload.venue,
          eventType: payload.eventType,
          registrationLink: payload.registrationLink,
          images: finalImages
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/admin/events');
      } else {
        const err = await res.json();
        alert(`Error saving event: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Failed to save event", err);
      alert("Failed to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="section py-20 text-center">
        <div className="text-xs font-mono text-muted uppercase animate-pulse">Loading Event Data...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="section py-20 text-center">
        <h1 className="section-title">Event Not Found</h1>
        <Link href="/admin/events" className="btn mt-8">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="section py-12 md:py-16">
      <div className="mb-8">
        <h1 className="section-title">Edit Event: {event.title}</h1>
        <Link href="/admin/events" className="text-xs uppercase tracking-widest mt-1 inline-block" style={{ color: '#6b6b6b' }}>
          &larr; Back to Events
        </Link>
      </div>

      {saving ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Saving changes...
        </div>
      ) : (
        <EventEditor event={event} onSave={handleSave} />
      )}
    </div>
  );
}
