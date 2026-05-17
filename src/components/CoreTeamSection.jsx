export default function CoreTeamSection({ lead, members = [] }) {
  const leader = lead || {
    name: 'Abdullah Haroon',
    role: 'President',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    bio: 'Leading society operations, technical infrastructure, and building a world-class developer community at IIUI.',
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
    <section id="team" className="section pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="section-header text-center mb-12">
        <span className="label justify-center">Society Organizers</span>
        <h2 className="section-title mt-4">Team Members</h2>
      </div>

      {/* 1. Leader (President) with Details on the Right */}
      <div className="mb-16 flex justify-center">
        <article className="card p-0 overflow-hidden max-w-2xl w-full bg-black border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col md:flex-row">
          {/* Picture on Left */}
          <div className="w-full md:w-[220px] shrink-0 aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-border overflow-hidden">
            <img
              src={leader.imageUrl || leader.img}
              alt={leader.name}
              className="w-full h-full object-cover brightness-95"
            />
          </div>
          {/* Details on Right */}
          <div className="p-6 md:p-8 flex flex-col justify-center text-left flex-1 bg-surface">
            <span className="label text-[8px] mb-2">{leader.role || leader.designation}</span>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">{leader.name}</h3>
            <p className="mt-4 text-xs text-muted leading-relaxed max-w-md">
              {leader.bio || 'Leading society operations and technical community initiatives at IIUI.'}
            </p>
          </div>
        </article>
      </div>

      {/* 2. Tiny Team Cards Grid Below */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {others.map((m, idx) => (
          <article key={idx} className="card p-0 overflow-hidden group/m border-white/5 hover:border-white/20 bg-black flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="overflow-hidden relative aspect-square border-b border-border">
                <img
                  src={m.imageUrl || m.img}
                  alt={m.name}
                  className="w-full h-full object-cover brightness-90 transition-all duration-500 group-hover/m:scale-105"
                />
              </div>
              <div className="p-3 bg-surface text-center">
                <span className="text-[7px] font-mono uppercase text-muted tracking-wider block mb-0.5">{m.role || m.designation}</span>
                <div className="text-[9px] font-black text-white uppercase tracking-tight truncate">{m.name}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}