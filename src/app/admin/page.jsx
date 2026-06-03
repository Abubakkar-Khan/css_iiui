'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to sign out?')) return;
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/admin/login');
    }
  };

  return (
    <div className="section py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="label">Admin Control Panel</span>
          <h1 className="section-title mt-2">Dashboard</h1>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Easily manage all pages, news posts, events, team members, and alumni from this central panel.
          </p>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-[10px] font-bold uppercase tracking-wider text-red-500/70 hover:text-red-500 transition-colors border border-border px-5 py-3 hover:bg-white/[0.02]"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminCard 
          title="Events" 
          description="Create, edit, or delete workshops and society events." 
          href="/admin/events" 
        />
        <AdminCard 
          title="News" 
          description="Post new announcements, achievements, or updates." 
          href="/admin/news" 
        />
        <AdminCard 
          title="Team Members" 
          description="Manage active society team members and their roles." 
          href="/admin/team" 
        />
        <AdminCard 
          title="Alumni Network" 
          description="Add, update, or remove graduated alumni profiles." 
          href="/admin/alumni" 
        />
        <AdminCard 
          title="Image Gallery" 
          description="Upload event pictures or general session memories." 
          href="/admin/gallery" 
        />
        <AdminCard 
          title="Account Security" 
          description="Change your login email or update password." 
          href="/admin/settings" 
        />
      </div>
    </div>
  );
}

function AdminCard({ title, description, href }) {
  return (
    <Link 
      href={href} 
      className="card p-8 group transition-colors block"
    >
      <span className="label text-[10px] group-hover:text-white transition-colors">{title}</span>
      <p className="mt-4 text-sm text-muted group-hover:text-fg transition-colors">
        {description}
      </p>
      <div className="mt-8 text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
        Open Page →
      </div>
    </Link>
  );
}
