'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [username, setUsername] = useState('admin');
  const [name, setName] = useState('Admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!password) {
      setMsg({ type: 'error', text: 'Password is required' });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password })
      });

      if (res.ok) {
        setMsg({ type: 'success', text: 'Admin credentials updated successfully!' });
        setPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        setMsg({ type: 'error', text: err.error || 'Failed to update credentials' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="max-w-xl">
        <Link href="/admin" className="label hover:text-white transition-colors">← Dashboard</Link>
        <h1 className="section-title mt-4">Security Settings</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          Update your administrator username, full profile name, and password securely.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="mt-12 max-w-xl space-y-6">
        {msg.text && (
          <div className={`p-4 border text-xs font-mono tracking-wide ${msg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {msg.type === 'success' ? 'SUCCESS: ' : 'ERROR: '} {msg.text}
          </div>
        )}

        <div>
          <label className="label mb-2 block">Admin Username / Email</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-surface border border-border focus:border-white outline-none transition-colors text-sm font-mono"
            placeholder="admin"
          />
        </div>

        <div>
          <label className="label mb-2 block">Profile Display Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-surface border border-border focus:border-white outline-none transition-colors text-sm"
            placeholder="Admin Name"
          />
        </div>

        <div>
          <label className="label mb-2 block">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-surface border border-border focus:border-white outline-none transition-colors text-sm font-mono"
            placeholder="••••••••••••"
          />
        </div>

        <div>
          <label className="label mb-2 block">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 bg-surface border border-border focus:border-white outline-none transition-colors text-sm font-mono"
            placeholder="••••••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn w-full mt-4"
        >
          {loading ? 'SAVING...' : 'UPDATE CREDENTIALS'}
        </button>
      </form>
    </div>
  );
}
