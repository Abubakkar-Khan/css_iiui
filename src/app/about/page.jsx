// src/app/about/page.jsx
import TimelineSection from '@/components/TimelineSection'

export default function AboutPage() {
  return (
    <div className="section py-12 md:py-20" id="about">
      <div className="max-w-3xl">
        <span className="label">The Society</span>
        <h1 className="section-title mt-2">About CSS IIUI</h1>
        <p className="mt-6 text-muted text-lg leading-relaxed">
          The Computer Science Society (CSS) at International Islamic University, Islamabad is the premier student organization 
          dedicated to fostering a culture of innovation, learning, and community within the Department of Computer Science.
        </p>
      </div>

      {/* Stats/Quick Info */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Founded', value: '2014' },
          { label: 'Members', value: '500+' },
          { label: 'Events', value: '150+' },
          { label: 'Alumni', value: '1000+' },
        ].map((stat, i) => (
          <div key={i} className="border-l pl-6 border-border">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="label mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Blocks */}
      <div className="mt-24 grid md:grid-cols-2 gap-12 lg:gap-24">
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">Our Mission</h2>
          <p className="text-muted text-sm leading-relaxed">
            To provide a platform for computer science students to enhance their technical skills, 
            network with industry professionals, and contribute to the local and global tech community 
            through collaborative projects and competitive programming.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">Our Vision</h2>
          <p className="text-muted text-sm leading-relaxed">
            To be recognized as a leading student society in the region, producing industry-ready 
            graduates who are not only technically proficient but also ethically grounded and 
            socially responsible.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mt-24">
        <TimelineSection title="Our Journey" subtitle="Key milestones and historical moments." />
      </div>

      {/* CTA */}
      <div className="mt-24 border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Interested in joining?</h2>
          <p className="text-muted text-sm mt-1">Become part of the most active community at IIUI.</p>
        </div>
        <a className="btn px-12" href="#join">Register Now</a>
      </div>
    </div>
  )
}