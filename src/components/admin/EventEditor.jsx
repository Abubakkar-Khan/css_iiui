// src/components/admin/EventEditor.jsx
'use client';

import { useState, useEffect } from 'react';

export default function EventEditor({ event = null, onSave }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [mediaList, setMediaList] = useState([]);
  const [locationType, setLocationType] = useState(event?.locationType || 'OFFLINE');
  const [venue, setVenue] = useState(event?.venue || '');
  const [eventType, setEventType] = useState(event?.eventType || 'Workshop');
  const [registrationLink, setRegistrationLink] = useState(event?.registrationLink || '');

  // Keep form fields synced if event data is fetched asynchronously
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setLocationType(event.locationType || 'OFFLINE');
      setVenue(event.venue || '');
      setEventType(event.eventType || 'Workshop');
      setRegistrationLink(event.registrationLink || '');
      
      if (event.images && event.images.length > 0) {
        setMediaList(event.images.map(img => ({
          id: img.id,
          url: img.url,
          caption: img.caption || ''
        })));
      } else {
        setMediaList([]);
      }
    }
  }, [event]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      caption: ''
    }));
    setMediaList(prev => [...prev, ...newItems]);
  };

  const updateCaption = (index, text) => {
    setMediaList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], caption: text };
      return updated;
    });
  };

  const removeMedia = (index) => {
    setMediaList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title) {
      alert('Please enter an event title');
      return;
    }
    const payload = { 
      title, 
      description, 
      mediaList,
      locationType,
      venue,
      eventType,
      registrationLink
    };
    await onSave?.(payload);
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Title */}
      <div>
        <label className="label mb-3 block">Event Title</label>
        <input
          className="w-full p-5 bg-surface border border-border text-2xl font-bold transition-colors focus:border-white outline-none text-white animate-none"
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

      {/* Registration Link */}
      <div>
        <label className="label mb-3 block">Registration Link (External)</label>
        <input
          type="url"
          className="w-full p-4 bg-[#0d0d0d] border border-border focus:border-white outline-none text-sm text-white"
          placeholder="https://forms.gle/example-link"
          value={registrationLink}
          onChange={e => setRegistrationLink(e.target.value)}
        />
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

      {/* Media Upload & Caption Management */}
      <div className="border border-border p-8 bg-surface space-y-6">
        <div>
          <label className="label mb-4 block">Event Images (Slideshow)</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple
            onChange={handleFileChange} 
            className="text-[10px] font-bold uppercase cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 file:hover:bg-[#333] transition-colors"
          />
        </div>

        {mediaList.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-muted">Manage Images & Captions ({mediaList.length})</h4>
            <div className="grid gap-4">
              {mediaList.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-black/40 border border-border">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 shrink-0 relative border border-border overflow-hidden bg-black">
                    <img 
                      src={item.url} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption Input */}
                  <div className="flex-1 w-full">
                    <input 
                      type="text" 
                      value={item.caption}
                      placeholder="Add image caption..." 
                      onChange={e => updateCaption(index, e.target.value)}
                      className="w-full p-3 bg-black/60 border border-border focus:border-white outline-none text-xs text-white transition-colors"
                    />
                  </div>

                  {/* Actions */}
                  <button 
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="text-[10px] font-mono font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors cursor-pointer sm:px-2 py-1 shrink-0"
                  >
                    [ Remove ]
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
