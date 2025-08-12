// src/app/team/page.jsx
export default function TeamPage() {
  const leads = [
    {
      name: 'Abdullah Haroon',
      role: 'President',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Junaid Khan',
      role: 'Vice President',
      img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Ayesha Tariq',
      role: 'General Secretary',
      img: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop',
    },
  ]

  const members = Array.from({ length: 12 }).map((_, i) => ({
    name: `Member ${i + 1}`,
    role: ['Ops', 'Tech', 'Design', 'PR'][i % 4],
    img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
  }))

  return (
    <div className="section py-12 md:py-16">
      {/* Centered & large title */}
      <h1 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight">
        Team
      </h1>

      {/* Leads: big, minimal cards */}
      <section className="mt-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((p, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden rounded-none bg-black text-white border border-white/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-[480px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-white/50">{p.role}</div>
                <h3 className="mt-2 text-2xl font-light">{p.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Members: clean minimal grid */}
      <section className="mt-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <article
              key={i}
              className="group relative overflow-hidden bg-black text-white border border-white/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-light">{m.name}</h4>
                <div className="text-xs uppercase tracking-widest text-white/50">{m.role}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
