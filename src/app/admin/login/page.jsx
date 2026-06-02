// src/app/admin/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
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
        body: JSON.stringify({ username, password })
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
          <h1 className="text-xl font-bold uppercase tracking-tight mt-4 text-white">System Verification</h1>
          <p className="text-muted text-[10px] mt-1 font-mono uppercase tracking-wider">
            CSS IIUI CONTROL PANEL
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono tracking-wide">
              ERROR: {error}
            </div>
          )}

          <div>
            <label className="label mb-2 block text-xs">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {loading ? 'AUTHENTICATING...' : 'ACCESS CONTROL PANEL'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="mx-4 text-xs font-mono text-muted uppercase">OR</span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        {/* Google Sign In Option */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="w-full btn-ghost py-4 flex items-center justify-center gap-3 cursor-pointer text-xs font-bold font-mono tracking-wider uppercase border border-border hover:border-white transition-all duration-300"
        >
          Sign In with Google
        </button>

        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
            Default ID: <strong className="text-white">admin</strong> | Key: <strong className="text-white">admin</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
