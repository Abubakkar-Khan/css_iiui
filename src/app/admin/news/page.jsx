'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await fetch('/api/news');
    if (res.ok) {
      const data = await res.json();
      setNewsList(data);
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setTitle(item.title);
    setDetails(item.details);
    setDate(new Date(item.date).toISOString().split('T')[0]);
    setImageFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingNews(null);
    setTitle('');
    setDetails('');
    setDate('');
    setImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = editingNews?.imageUrl || '';

    // Handle Cloudinary Upload
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
        alert('Image upload failed. Storing news without image.');
      }
    }

    const payload = { title, details, date: new Date(date).toISOString(), imageUrl };
    const method = editingNews ? 'PUT' : 'POST';
    const endpoint = editingNews ? `/api/news/${editingNews.id}` : '/api/news';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      handleCancel();
      fetchNews();
    } else {
      const err = await res.json();
      alert(`Error saving news: ${err.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this news post?')) return;
    const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNewsList(newsList.filter(item => item.id !== id));
    } else {
      alert('Failed to delete news post.');
    }
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <Link href="/admin" className="label hover:text-white transition-colors">← Dashboard</Link>
          <h1 className="section-title mt-4">Manage News</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Create, update, or remove announcements, news stories, and society highlights.
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn">
            + Add News Post
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-8 bg-surface max-w-3xl space-y-6 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            {editingNews ? 'Edit News Post' : 'New News Post'}
          </h2>

          <div>
            <label className="label mb-2 block">News Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm"
              placeholder="CSS IIUI Launches New Workspace Portal"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2 block">Publish Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
              />
            </div>
            <div>
              <label className="label mb-2 block">Cover Photo (Cloudinary)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                className="text-xs text-muted cursor-pointer file:bg-border file:border-none file:text-white file:px-4 file:py-2 file:mr-4 transition-colors"
              />
              {editingNews?.imageUrl && !imageFile && (
                <span className="text-[10px] text-muted font-mono block mt-2">ACTIVE IMAGE: {editingNews.imageUrl}</span>
              )}
            </div>
          </div>

          <div>
            <label className="label mb-2 block">News Details / Announcement Content</label>
            <textarea
              required
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm min-h-[150px] leading-relaxed"
              placeholder="Share the full announcement here..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={handleCancel} className="btn bg-transparent border border-border text-muted hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'SAVING...' : 'PUBLISH NEWS'}
            </button>
          </div>
        </form>
      )}

      {/* News Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {newsList.map(item => (
          <article key={item.id} className="card p-0 overflow-hidden bg-black flex flex-col justify-between h-full border border-border hover:border-white/20 transition-all duration-300">
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-black">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span className="label text-[9px] mb-2">
                  {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-tight mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-4">
                  {item.details}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 bg-surface">
              <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted hover:text-white transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-500/70 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {newsList.length === 0 && (
        <div className="border border-border p-20 text-center text-sm text-muted bg-surface mt-8">
          No news announcements registered. Create your first post above!
        </div>
      )}
    </div>
  );
}
