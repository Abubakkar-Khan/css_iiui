'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAlumniPage() {
  // Mock data for now, in a real app this would be fetched from /api/alumni
  const [alumni, setAlumni] = useState([
    { id: 1, name: 'Ahmad Raza', gradYear: '2020', company: 'Google' },
    { id: 2, name: 'Fatima Noor', gradYear: '2019', company: 'Microsoft' },
  ]);

  return (
    <div className="section py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Manage Alumni</h1>
          <Link href="/admin" className="text-xs uppercase tracking-widest mt-1 inline-block" style={{ color: '#6b6b6b' }}>
            &larr; Back to Dashboard
          </Link>
        </div>
        <button className="btn">
          + Add Alumni
        </button>
      </div>

      <div className="border" style={{ borderColor: '#d4d4d4' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: '#f7f7f7', borderBottom: '1px solid #d4d4d4' }}>
              <th className="p-4 text-xs uppercase tracking-widest font-semibold" style={{ color: '#6b6b6b' }}>Year</th>
              <th className="p-4 text-xs uppercase tracking-widest font-semibold" style={{ color: '#6b6b6b' }}>Name</th>
              <th className="p-4 text-xs uppercase tracking-widest font-semibold" style={{ color: '#6b6b6b' }}>Company</th>
              <th className="p-4 text-xs uppercase tracking-widest font-semibold text-right" style={{ color: '#6b6b6b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map(person => (
              <tr key={person.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td className="p-4 text-sm" style={{ color: '#6b6b6b' }}>{person.gradYear}</td>
                <td className="p-4 text-sm font-semibold" style={{ color: '#0a0a0a' }}>{person.name}</td>
                <td className="p-4 text-sm" style={{ color: '#6b6b6b' }}>{person.company}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-4">
                    <button className="text-xs uppercase tracking-widest font-bold hover:underline">
                      Edit
                    </button>
                    <button className="text-xs uppercase tracking-widest font-bold text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
