'use client';

import dynamic from "next/dynamic";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const EventEditor = dynamic(() => import("@/components/admin/EventEditor"), {
  ssr: false,
});

export default function NewEventPage() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  const handleSave = async (payload) => {
    setSyncing(true);
    const imageUrls = [];
    
    // Upload multiple slideshow images one by one
    if (payload.featuredImages && payload.featuredImages.length > 0) {
      for (const file of payload.featuredImages) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch('/api/upload-url', {
            method: 'POST',
            body: formData,
          });
          
          if (res.ok) {
            const data = await res.json();
            imageUrls.push(data.url);
          } else {
            console.error(`Failed to upload ${file.name}`);
          }
        } catch (err) {
          console.error(`Error uploading ${file.name}`, err);
        }
      }
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({ 
          title: payload.title, 
          description: payload.description, 
          date: new Date().toISOString(),
          locationType: payload.locationType,
          venue: payload.venue,
          eventType: payload.eventType,
          images: imageUrls
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
      setSyncing(false);
    }
  };

  return (
    <div className="section py-12 md:py-16">
      <div className="mb-8">
        <h1 className="section-title">Create New Event</h1>
        <Link href="/admin/events" className="text-xs uppercase tracking-widest mt-1 inline-block" style={{ color: '#6b6b6b' }}>
          &larr; Back to Events
        </Link>
      </div>

      {syncing ? (
        <div className="text-center py-20 text-xs font-mono text-muted uppercase animate-pulse">
          Uploading images & saving event...
        </div>
      ) : (
        <EventEditor onSave={handleSave} />
      )}
    </div>
  );
}
