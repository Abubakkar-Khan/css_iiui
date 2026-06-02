'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [caption, setCaption] = useState('');
  const [eventId, setEventId] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchEvents();
  }, []);

  const fetchImages = async () => {
    const res = await fetch('/api/gallery');
    if (res.ok) {
      const data = await res.json();
      setImages(data);
    }
  };

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
  };

  const handleCancel = () => {
    setCaption('');
    setEventId('');
    setImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image file to upload.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload file server-side to Cloudinary
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadRes = await fetch('/api/upload-url', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error('Image streaming failed to Cloudinary cloud.');
      }

      const uploadData = await uploadRes.json();
      const url = uploadData.url;

      // 2. Register Image in local DB
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          caption,
          eventId: eventId ? Number(eventId) : null
        })
      });

      if (res.ok) {
        handleCancel();
        fetchImages();
      } else {
        const err = await res.json();
        alert(`Error saving to gallery database: ${err.error}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setImages(images.filter(img => img.id !== id));
    } else {
      alert('Failed to remove image asset.');
    }
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <Link href="/admin" className="label hover:text-white transition-colors">← Dashboard</Link>
          <h1 className="section-title mt-4">Society Gallery</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Upload memories, link them dynamically to specific events, or let them remain independent.
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn">
            + Upload Asset
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-8 bg-surface max-w-2xl space-y-6 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight">Upload New Photo</h2>

          <div>
            <label className="label mb-2 block">Choose Local Image</label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="text-xs text-muted cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 transition-colors"
            />
          </div>

          <div>
            <label className="label mb-2 block">Caption / Description</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
              placeholder="Moment from CSS Developer Hackathon..."
            />
          </div>

          <div>
            <label className="label mb-2 block">Link to Event (Optional)</label>
            <select
              value={eventId}
              onChange={e => setEventId(e.target.value)}
              className="w-full p-4 bg-[#0d0d0d] border border-border focus:border-white outline-none transition-colors text-sm text-white"
            >
              <option value="">Independent / General (No specific event link)</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({new Date(ev.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={handleCancel} className="btn bg-transparent border border-border text-muted hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'STREAMING...' : 'INITIALIZE UPLOAD'}
            </button>
          </div>
        </form>
      )}

      {/* Renders dynamic image grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img.id} className="border border-border bg-surface overflow-hidden group relative aspect-square flex flex-col justify-end">
            <img src={img.url} alt={img.caption || 'Gallery Image'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[9px] uppercase font-bold tracking-wider text-blue-400 block mb-1">
                {img.event ? `Event: ${img.event.title}` : 'General Asset'}
              </span>
              <p className="text-xs text-white line-clamp-2 leading-relaxed mb-4">{img.caption || 'No Caption Provided'}</p>
              <button onClick={() => handleDelete(img.id)} className="w-full btn bg-red-600/80 hover:bg-red-600 text-[9px] py-2">
                Purge Asset
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full border border-border p-20 text-center text-sm text-muted bg-surface">
            No gallery assets synchronized. Initialize your first upload.
          </div>
        )}
      </div>
    </div>
  );
}
