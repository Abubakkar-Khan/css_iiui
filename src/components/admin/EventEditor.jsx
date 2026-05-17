'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

export default function EventEditor({ event = null, onSave }) {
  const [title, setTitle] = useState(event?.title || '');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link, TextStyle, Color, FontFamily],
    content: event?.description || '',
    immediatelyRender: false,
  });

  if (!isMounted) return <p className="label p-20 text-center">Loading interface...</p>;

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const [locationType, setLocationType] = useState(event?.locationType || 'OFFLINE');
  const [venue, setVenue] = useState(event?.venue || '');
  const [eventType, setEventType] = useState(event?.eventType || 'Workshop');

  const handleSave = async () => {
    const description = editor?.getHTML() || '';
    const payload = { 
      title, 
      description, 
      featuredImage,
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
        <label className="label mb-3 block">Fragment Title</label>
        <input
          className="w-full p-5 bg-surface border border-border text-2xl font-bold transition-colors focus:border-white outline-none"
          placeholder="Untitled Fragment"
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

      {/* Editor & Toolbar Container */}
      <div className="border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap bg-[#0d0d0d] border-b border-border">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} label="Bold" active={editor.isActive('bold')} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic" active={editor.isActive('italic')} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" active={editor.isActive('heading', { level: 2 })} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" active={editor.isActive('heading', { level: 3 })} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} label="List" active={editor.isActive('bulletList')} />
          <ToolbarButton onClick={addImage} label="Add Image" />
          <div className="flex-1" />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="Undo" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} label="Redo" />
        </div>

        {/* Editor Area */}
        <EditorContent editor={editor} className="p-8 min-h-[450px] prose prose-invert max-w-none bg-surface focus:outline-none text-muted" />
      </div>

      {/* Media Upload */}
      <div className="border border-border p-8 bg-surface">
        <label className="label mb-4 block">Primary Media</label>
        <div className="flex items-center gap-6">
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFeaturedImage(e.target.files[0])} 
            className="text-[10px] font-bold uppercase cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 file:hover:bg-[#333] transition-colors"
          />
          {featuredImage && (
            <span className="text-[10px] font-mono text-muted">
              FILE: {featuredImage.name}
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
          Initialize Sync
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, label, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-r border-border ${active ? 'bg-white text-black' : 'text-muted hover:text-white hover:bg-white/5'}`}
    >
      {label}
    </button>
  );
}
