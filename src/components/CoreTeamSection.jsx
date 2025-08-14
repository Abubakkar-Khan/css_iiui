export default function CoreTeamSection({ lead, members = [] }) {
  const leader = lead || {
    name: "Abdullah Haroon",
    role: "President",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };
  const others = members.length
    ? members
    : Array.from({ length: 6 }).map((_, i) => ({
        name: "Junaid",
        role: [
          "V President",
          "General Sec",
          "Operations Lead",
          "Technical Lead",
        ][i % 4],
        img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop",
      }));
  return (
    <section id="team" className="section py-12 md:py-16">
      <h2 className="section-title text-center">Core Team</h2>
      <div className="card mt-8">
        <div className="grid md:grid-cols-[220px_1fr] gap-6 items-center">
          <img
            src={leader.img}
            alt="leader"
            className="rounded-xl w-full h-[220px] object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold">{leader.name}</h3>
            <p className="text-white/70">{leader.role}</p>
            <p className="mt-3 text-white/80 max-w-2xl">{leader.bio}</p>
            <div className="mt-4 flex gap-3 text-xl" aria-label="socials">
              <a href="#" aria-label="Instagram">
                📷
              </a>
              <a href="#" aria-label="Facebook">
                📘
              </a>
              <a href="#" aria-label="LinkedIn">
                💼
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {others.map((m, idx) => (
            <div
              key={idx}
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-center"
            >
              <img
                src={m.img}
                alt={m.name}
                className="rounded-md aspect-square object-cover mb-2"
              />
              <div className="text-sm font-semibold">{m.name}</div>
              <div className="text-[11px] text-white/60">{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
