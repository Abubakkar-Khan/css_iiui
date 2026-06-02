// src/app/about/page.jsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="section py-16 md:py-24" id="about">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="label justify-center">The Society</span>
        <h1 className="section-title mt-2 text-white">About CSS IIUI</h1>
      </div>

      {/* Stats/Quick Info */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        {[
          { label: 'Founded', value: '1998' },
          { label: 'Events', value: '50+' },
          { label: 'Student Reach', value: '1000+' },
        ].map((stat, i) => (
          <div key={i} className="border border-border p-8 bg-surface">
            <div className="text-4xl md:text-5xl font-black text-white">{stat.value}</div>
            <div className="text-xs uppercase font-mono tracking-widest text-muted mt-2 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Blocks */}
      <div className="mt-20 max-w-3xl mx-auto text-center space-y-8 text-base md:text-lg leading-relaxed text-muted font-medium">
        <p>
          The Computer Science Society (CSS) at International Islamic University Islamabad is a student-led society of the Department of Computer Science, working to promote learning, collaboration, and technical growth among students.
        </p>
        <p>
          Founded in 1998, CSS IIUI has organized 50+ academic, technical, and community-focused events, reaching more than 1000 students through workshops, seminars, competitions, and awareness sessions.
        </p>
      </div>

      <div className="text-center mt-12">
        <Link href="/" className="btn">
          Back to Portal
        </Link>
      </div>
    </div>
  )
}