// src/app/admin/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-border p-8 md:p-10 bg-surface relative">
        
        <div className="mb-8">
          <Link href="/" className="text-xs font-mono uppercase tracking-widest text-muted hover:text-white transition-colors">← Public Portal</Link>
          <h1 className="text-xl font-bold uppercase tracking-tight mt-4 text-white">Admin Login</h1>
          <p className="text-muted text-[10px] mt-1 font-mono uppercase tracking-wider">
            Control Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono tracking-wide">
              ERROR: {error}
            </div>
          )}

          <div>
            <label className="label mb-2 block text-xs">Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm font-mono text-white"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="label mb-2 block text-xs">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm font-mono text-white"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn py-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
            Default Email: <strong className="text-white">admin</strong> | Key: <strong className="text-white">admin</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

