'use client';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="section py-12 md:py-20">
      <div className="max-w-xl">
        <span className="label">Operational Control</span>
        <h1 className="section-title mt-2">Admin Dashboard</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          Manage society content, track events, and update the member database.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminCard 
          title="Events" 
          description="Manage the event roadmap and archives." 
          href="/admin/events" 
        />
        <AdminCard 
          title="Team" 
          description="Update core team members and hierarchy." 
          href="/admin/team" 
        />
        <AdminCard 
          title="Alumni" 
          description="Maintain the graduate network database." 
          href="/admin/alumni" 
        />
        <AdminCard 
          title="Gallery" 
          description="Upload and organize session memories." 
          href="/admin/gallery" 
        />
        <AdminCard 
          title="FAQs" 
          description="Update common protocol queries." 
          href="/admin/faqs" 
        />
      </div>
    </div>
  );
}

function AdminCard({ title, description, href }) {
  return (
    <Link 
      href={href} 
      className="card p-8 group transition-colors"
    >
      <span className="label text-[10px] group-hover:text-white transition-colors">{title}</span>
      <p className="mt-4 text-sm text-muted group-hover:text-fg transition-colors">
        {description}
      </p>
      <div className="mt-8 text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
        Initialize Management →
      </div>
    </Link>
  );
}
