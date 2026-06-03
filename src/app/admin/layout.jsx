'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data.admin) {
        setAuthorized(true);
        if (pathname === '/admin/login') {
          router.push('/admin');
        }
      } else {
        setAuthorized(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    } catch (err) {
      setAuthorized(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xs font-mono tracking-widest text-muted uppercase animate-pulse">
          Verifying login...
        </div>
      </div>
    );
  }

  if (authorized || pathname === '/admin/login') {
    return <>{children}</>;
  }

  return null;
}
