'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminTeamPage() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [details, setDetails] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch('/api/team');
    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
  };

  const handleEdit = (m) => {
    setEditingMember(m);
    setName(m.name);
    setDesignation(m.designation);
    setDetails(m.details || '');
    setInstagram(m.instagram || '');
    setLinkedin(m.linkedin || '');
    setFacebook(m.facebook || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingMember(null);
    setName('');
    setDesignation('');
    setDetails('');
    setInstagram('');
    setLinkedin('');
    setFacebook('');
    setImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = editingMember?.imageUrl || '';

    // Handle Cloudinary Image upload if a file is selected
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
        alert('Headshot upload failed. Storing metadata without custom image.');
      }
    }

    const payload = { name, designation, details, imageUrl, instagram, linkedin, facebook };
    const method = editingMember ? 'PUT' : 'POST';
    const endpoint = editingMember ? `/api/team/${editingMember.id}` : '/api/team';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      handleCancel();
      fetchMembers();
    } else {
      const err = await res.json();
      alert(`Error saving profile: ${err.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this executive member?')) return;

    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers(members.filter(m => m.id !== id));
    } else {
      alert('Failed to remove executive profile.');
    }
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <Link href="/admin" className="label hover:text-white transition-colors">← Dashboard</Link>
          <h1 className="section-title mt-4">Manage Team</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Create, update, and manage the society executive cabinet roster.
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn">
            + Add Executive
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-8 bg-surface max-w-3xl space-y-6 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            {editingMember ? 'Edit Executive Member' : 'New Executive Member'}
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
              <label className="label mb-2 block">Designation</label>
              <input
                type="text"
                required
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
                placeholder="President"
              />
            </div>
          </div>

          <div>
            <label className="label mb-2 block">Bio Details / Quote</label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm min-h-[100px]"
              placeholder="Leading innovation and empowering developers..."
            />
          </div>

          {/* Media Headshot */}
          <div>
            <label className="label mb-2 block">Executive Headshot (Cloudinary)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="text-xs text-muted cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 transition-colors"
            />
            {editingMember?.imageUrl && !imageFile && (
              <span className="text-[10px] text-muted font-mono block mt-2">ACTIVE IMAGE: {editingMember.imageUrl}</span>
            )}
          </div>

          {/* Social Coordinates */}
          <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border/40">
            <div>
              <label className="label mb-2 block">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className="w-full p-3 bg-black/40 border border-border focus:border-white outline-none transition-colors text-xs font-mono"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="label mb-2 block">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                className="w-full p-3 bg-black/40 border border-border focus:border-white outline-none transition-colors text-xs font-mono"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="label mb-2 block">Facebook URL</label>
              <input
                type="text"
                value={facebook}
                onChange={e => setFacebook(e.target.value)}
                className="w-full p-3 bg-black/40 border border-border focus:border-white outline-none transition-colors text-xs font-mono"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={handleCancel} className="btn bg-transparent border border-border text-muted hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'SAVING...' : 'SYNC MEMBER'}
            </button>
          </div>
        </form>
      )}

      {/* Executives List */}
      <div className="border border-border bg-surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-[#0d0d0d]">
              <th className="p-5 label">Avatar</th>
              <th className="p-5 label">Full Name</th>
              <th className="p-5 label">Designation</th>
              <th className="p-5 label text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-white/[0.01] transition-colors">
                <td className="p-5">
                  <img
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
                    alt={m.name}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                </td>
                <td className="p-5 text-sm font-bold text-white">{m.name}</td>
                <td className="p-5 text-xs text-muted font-mono">{m.designation}</td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(m)} className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="text-[10px] font-bold uppercase tracking-wider text-red-500/70 hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="4" className="p-20 text-center text-sm text-muted">
                  No executive roster members registered. Initialize database seed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
