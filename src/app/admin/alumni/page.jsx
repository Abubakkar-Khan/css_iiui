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
      alert(editingAlumni ? 'Alumni profile synced!' : 'Alumni profile added!');
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
          <h1 className="section-title mt-4">Manage Alumni</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Record, prioritize, and showcase society graduates and their career landmarks.
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn">
            + Add Alumni
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-8 bg-surface max-w-3xl space-y-6 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight">
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
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
                placeholder="Abdullah Khan"
              />
            </div>
            <div>
              <label className="label mb-2 block">Graduation Batch Designation</label>
              <input
                type="text"
                required
                value={gradYear}
                onChange={e => setGradYear(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
                placeholder="F20"
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
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
                placeholder="Google"
              />
            </div>
            <div>
              <label className="label mb-2 block">Placement Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
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
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-xs font-mono"
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
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
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
            <button type="button" onClick={handleCancel} className="btn bg-transparent border border-border text-muted hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'SAVING...' : 'SYNC ALUMNI'}
            </button>
          </div>
        </form>
      )}

      {/* Alumni List */}
      <div className="border border-border bg-surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-[#0d0d0d]">
              <th className="p-5 label">Avatar</th>
              <th className="p-5 label">Name / Batch</th>
              <th className="p-5 label">Career Placement</th>
              <th className="p-5 label">Weight</th>
              <th className="p-5 label text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map(al => (
              <tr key={al.id} className="border-b border-border/50 hover:bg-white/[0.01] transition-colors">
                <td className="p-5">
                  <img
                    src={al.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
                    alt={al.name}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                </td>
                <td className="p-5">
                  <div className="text-sm font-bold text-white">{al.name}</div>
                  <span className="text-[9px] font-mono bg-border px-2 py-0.5 mt-1 inline-block uppercase text-muted">BATCH {al.gradYear}</span>
                </td>
                <td className="p-5 text-xs text-muted">
                  {al.role && al.company ? `${al.role} at ${al.company}` : al.company || al.role || 'Seeking Opportunities'}
                </td>
                <td className="p-5 text-xs font-mono text-white">{al.priority}</td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(al)} className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(al.id)} className="text-[10px] font-bold uppercase tracking-wider text-red-500/70 hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {alumni.length === 0 && (
              <tr>
                <td colSpan="5" className="p-20 text-center text-sm text-muted">
                  No alumni cohorts registered. Initialize alumni data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
