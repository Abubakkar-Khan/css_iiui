// src/app/events/page.jsx
export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'IT Department Orientation 2024',
      date: 'Aug 16, 2024',
      status: 'upcoming',
      img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Welcoming the new batch of computer science students to IIUI. Join us for a full day of onboarding and networking.',
    },
    {
      id: 2,
      title: 'Workshop: Modern Web with Next.js',
      date: 'Sep 02, 2024',
      status: 'upcoming',
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Learn to build production-ready applications with Next.js 15, Tailwind CSS, and Prisma.',
    },
    {
      id: 3,
      title: 'Tech Talk: AI in Cybersecurity',
      date: 'Sep 18, 2024',
      status: 'upcoming',
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Industry experts discuss the role of machine learning in modern security operations.',
    },
    {
      id: 4,
      title: 'Annual Coding Competition',
      date: 'Oct 26, 2024',
      status: 'past',
      img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
      excerpt: 'A 24-hour challenge to solve real-world problems through innovative software solutions.',
    },
    {
      id: 5,
      title: 'Hack Night: Zero to One',
      date: 'Nov 12, 2024',
      status: 'past',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Rapid prototyping session where students build and ship a project in a single night.',
    },
    {
      id: 6,
      title: 'OSS Sprint IIUI',
      date: 'Dec 03, 2024',
      status: 'past',
      img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Contributing to major open source projects and improving local society tools.',
    },
  ]

  return (
    <div className="section py-12 md:py-20">
      <div className="max-w-2xl">
        <span className="label">The Roadmap</span>
        <h1 className="section-title mt-2">Events & Programs</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          From technical workshops and industry talks to high-stakes hackathons, 
          discover how the Computer Science Society is building the future of tech at IIUI.
        </p>
      </div>

      {/* Upcoming Section */}
      <div className="mt-16">
        <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Upcoming Events</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.filter(e => e.status === 'upcoming').map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </div>

      {/* Past Section */}
      <div className="mt-24 border-t border-border pt-16">
        <h2 className="text-xl font-bold uppercase tracking-tight mb-8 text-muted">Past Events Archive</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.filter(e => e.status === 'past').map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }) {
  return (
    <article className="card p-0 flex flex-col group overflow-hidden h-full">
      <div className="overflow-hidden aspect-video">
        <img
          src={event.img}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="label text-[10px]">{event.date}</span>
        <h3 className="mt-2 text-lg font-bold text-white group-hover:text-muted transition-colors">
          {event.title}
        </h3>
        <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
          {event.excerpt}
        </p>
        <div className="mt-auto pt-6">
          <a href={`/events/${event.id}`} className="btn-ghost w-full text-[10px]">
            Access Fragment →
          </a>
        </div>
      </div>
    </article>
  )
}
