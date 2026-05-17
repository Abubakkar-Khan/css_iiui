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
    console.log("Saving event:", payload);
    // In a real app, you'd handle file upload and API call here
    // Example:
    // const formData = new FormData();
    // formData.append('title', payload.title);
    // formData.append('description', payload.description);
    // if (payload.featuredImage) formData.append('image', payload.featuredImage);
    // await fetch('/api/events', { method: 'POST', body: formData });
    
    alert('Event saved (simulated)');
    router.push('/admin/events');
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
