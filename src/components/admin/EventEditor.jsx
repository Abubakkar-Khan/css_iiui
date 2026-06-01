'use client';

import { useState } from 'react';

export default function EventEditor({ event = null, onSave }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [featuredImages, setFeaturedImages] = useState([]);
  const [locationType, setLocationType] = useState(event?.locationType || 'OFFLINE');
  const [venue, setVenue] = useState(event?.venue || '');
  const [eventType, setEventType] = useState(event?.eventType || 'Workshop');

  const handleSave = async () => {
    if (!title) {
      alert('Please enter an event title');
      return;
    }
    const payload = { 
      title, 
      description, 
      featuredImages,
      locationType,
      venue,
      eventType
    };
    await onSave?.(payload);
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Title */}
      <div>
        <label className="label mb-3 block">Event Title</label>
        <input
          className="w-full p-5 bg-surface border border-border text-2xl font-bold transition-colors focus:border-white outline-none text-white"
          placeholder="Enter Event Title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-3 gap-6 bg-surface border border-border p-6">
        <div>
          <label className="label mb-2 block">Event Type</label>
          <select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            className="w-full p-4 bg-[#0d0d0d] border border-border focus:border-white outline-none text-sm text-white"
          >
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Speaker Session">Speaker Session</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="label mb-2 block">Location Type</label>
          <select
            value={locationType}
            onChange={e => setLocationType(e.target.value)}
            className="w-full p-4 bg-[#0d0d0d] border border-border focus:border-white outline-none text-sm text-white"
          >
            <option value="OFFLINE">OFFLINE (Physical)</option>
            <option value="ONLINE">ONLINE (Virtual)</option>
          </select>
        </div>

        <div>
          <label className="label mb-2 block">Venue / Link</label>
          <input
            type="text"
            value={venue}
            onChange={e => setVenue(e.target.value)}
            className="w-full p-4 bg-[#0d0d0d] border border-border focus:border-white outline-none text-sm text-white"
            placeholder="e.g. Auditorium B, Zoom Link"
          />
        </div>
      </div>

      {/* Textarea Description Editor */}
      <div>
        <label className="label mb-3 block">Event Description</label>
        <textarea
          className="w-full p-6 bg-[#0a0a0a] border border-border transition-colors focus:border-white outline-none text-sm text-white min-h-[300px]"
          placeholder="Write the event details here..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* Media Upload */}
      <div className="border border-border p-8 bg-surface">
        <label className="label mb-4 block">Event Images (Slideshow)</label>
        <div className="flex flex-col gap-4">
          <input 
            type="file" 
            accept="image/*" 
            multiple
            onChange={e => setFeaturedImages(Array.from(e.target.files))} 
            className="text-[10px] font-bold uppercase cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 file:hover:bg-[#333] transition-colors"
          />
          {featuredImages.length > 0 && (
            <span className="text-[10px] font-mono text-muted mt-2">
              {featuredImages.length} file(s) selected: {featuredImages.map(f => f.name).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Final Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="btn px-16"
        >
          Save Event
        </button>
      </div>
    </div>
  );
}
