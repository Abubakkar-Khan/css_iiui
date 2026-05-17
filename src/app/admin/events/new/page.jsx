'use client';

import dynamic from "next/dynamic";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EventEditor = dynamic(() => import("@/components/admin/EventEditor"), {
  ssr: false,
});

export default function NewEventPage() {
  const router = useRouter();

  const handleSave = async (payload) => {
    let imageUrl = '';
    
    if (payload.featuredImage) {
      const formData = new FormData();
      formData.append('file', payload.featuredImage);

      const res = await fetch('/api/upload-url', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        imageUrl = data.url;
      } else {
        alert('Image upload failed. Saving event without image.');
      }
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ 
        title: payload.title, 
        description: payload.description, 
        date: new Date().toISOString(),
        imageUrl 
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('Event created successfully!');
      router.push('/admin/events');
    } else {
      const err = await res.json();
      alert(`Error saving event: ${err.error || 'Unknown error'}`);
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

      <EventEditor onSave={handleSave} />
    </div>
  );
}
