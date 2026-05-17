export default function CoreTeamSection({ lead, members = [] }) {
  const leader = lead || {
    name: 'Abdullah Haroon',
    role: 'President',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    bio: 'Commanding lead for society operations. Focused on technical infrastructure and community engineering.',
  }
  const others = members.length
    ? members
    : [
        { name: 'Junaid Khan', role: 'V President', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
        { name: 'Ayesha Tariq', role: 'Gen Sec', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
        { name: 'Hamza Ali', role: 'Tech Lead', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
        { name: 'Fatima Noor', role: 'Operations', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' },
        { name: 'Usman Sheikh', role: 'Design', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
        { name: 'Zainab Malik', role: 'Media', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
      ]

  return (
    <section id="team" className="section py-16 md:py-32">
      <div className="text-center mb-16">
        <span className="label justify-center">Executive Command</span>
        <h2 className="section-title mt-4">Core Team</h2>
      </div>

      {/* Featured Leader */}
      <div className="card overflow-hidden p-0 mb-8 border-white/10">
        <div className="grid md:grid-cols-[320px_1fr]">
          <div className="relative group overflow-hidden h-80 md:h-auto">
            <img
              src={leader.img}
              alt={leader.name}
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-4 left-4 font-mono text-[8px] bg-black/80 px-2 py-1 border border-white/10 opacity-60">
              RANK: COMMANDER
            </div>
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center bg-surface">
            <span className="label mb-2">{leader.role}</span>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">{leader.name}</h3>
            <p className="mt-6 text-sm text-muted leading-relaxed max-w-lg font-medium">{leader.bio}</p>
            <div className="mt-8 flex gap-8">
              {['Instagram', 'LinkedIn'].map(p => (
                <a key={p} href="#" className="font-mono text-[9px] font-bold text-muted hover:text-white transition-colors tracking-widest uppercase">{p}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {others.map((m, idx) => (
          <article key={idx} className="card p-0 overflow-hidden group/m border-white/5 hover:border-white/20">
            <div className="overflow-hidden relative aspect-square">
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-full object-cover grayscale brightness-75 transition-all duration-500 group-hover/m:grayscale-0 group-hover/m:brightness-100 group-hover/m:scale-110"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="p-4 bg-surface">
              <span className="label text-[8px] mb-1">{m.role}</span>
              <div className="text-[11px] font-black text-white uppercase tracking-wider">{m.name}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}