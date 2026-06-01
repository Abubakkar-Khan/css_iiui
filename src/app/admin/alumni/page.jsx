'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [priority, setPriority] = useState(2);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    const res = await fetch('/api/alumni');
    if (res.ok) {
      const data = await res.json();
      setAlumni(data);
    }
  };

  const handleEdit = (al) => {
    setEditingAlumni(al);
    setName(al.name);
    setGradYear(al.gradYear);
    setCompany(al.company || '');
    setRole(al.role || '');
    setLinkedin(al.linkedin || '');
    setPriority(al.priority ?? 2);
    setImageFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingAlumni(null);
    setName('');
    setGradYear('');
    setCompany('');
    setRole('');
    setLinkedin('');
    setPriority(2);
    setImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = editingAlumni?.imageUrl || '';

    // Handle portrait uploader if a new local file is chosen
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadRes = await fetch('/api/upload-url', {
        method: 'POST',
        body: formData
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      } else {
        alert('Portrait upload failed. Saving details without custom image.');
      }
    }

    const payload = { name, gradYear, company, role, imageUrl, linkedin, priority: Number(priority) };
    const method = editingAlumni ? 'PUT' : 'POST';
    const endpoint = editingAlumni ? `/api/alumni/${editingAlumni.id}` : '/api/alumni';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      handleCancel();
      fetchAlumni();
    } else {
      const err = await res.json();
      alert(`Error saving alumni: ${err.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Proceed with purging this alumni profile?')) return;

    const res = await fetch(`/api/alumni/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAlumni(alumni.filter(al => al.id !== id));
    } else {
      alert('Failed to remove alumni profile.');
    }
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <Link href="/admin" className="label hover:text-white transition-colors">← Dashboard</Link>
          <h1 className="section-title mt-4 text-white">Manage Alumni</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Record, prioritize, and showcase society graduates and their career landmarks.
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn cursor-pointer">
            + Add Alumni
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-8 bg-surface max-w-3xl space-y-6 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">
            {editingAlumni ? 'Edit Alumni Profile' : 'New Alumni Profile'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                placeholder="Abdullah Khan"
              />
            </div>
            <div>
              <label className="label mb-2 block">Graduation Year</label>
              <input
                type="text"
                required
                value={gradYear}
                onChange={e => setGradYear(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                placeholder="2024"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2 block">Placement Company</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                placeholder="Google"
              />
            </div>
            <div>
              <label className="label mb-2 block">Placement Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                placeholder="Senior Engineer"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2 block">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-xs font-mono text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="label mb-2 block">Priority Sort Weight (Lower = Pinned first)</label>
              <input
                type="number"
                required
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                placeholder="2"
              />
            </div>
          </div>

          {/* Media Portrait */}
          <div>
            <label className="label mb-2 block">Corporate Portrait Image (Cloudinary)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="text-xs text-muted cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 transition-colors"
            />
            {editingAlumni?.imageUrl && !imageFile && (
              <span className="text-[10px] text-muted font-mono block mt-2">ACTIVE IMAGE: {editingAlumni.imageUrl}</span>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={handleCancel} className="btn bg-transparent border border-border text-muted hover:text-white cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn cursor-pointer">
              {loading ? 'SAVING...' : 'SYNC ALUMNI'}
            </button>
          </div>
        </form>
      )}

      {/* Alumni Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {alumni.map(al => (
          <article key={al.id} className="card p-4 flex flex-col group border-white/5 hover:border-white/20 transition-all duration-300 bg-black justify-between h-full">
            <div>
              <div className="relative overflow-hidden aspect-square border border-white/10 mb-4 bg-black">
                <img
                  src={al.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'}
                  alt={al.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <span className="label text-[9px] mb-2">Class of {al.gradYear}</span>
              <h3 className="text-md font-black uppercase tracking-tight text-white transition-colors truncate">
                {al.name}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed font-medium">
                {al.role} {al.company && <><span className="text-white/30">@</span> {al.company}</>}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3 bg-black">
              <button
                onClick={() => handleEdit(al)}
                className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(al.id)}
                className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-500/70 hover:text-red-400 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {alumni.length === 0 && (
        <div className="border border-border p-20 text-center text-sm text-muted bg-surface mt-8">
          No alumni cohorts registered. Initialize alumni data.
        </div>
      )}
    </div>
  );
}
