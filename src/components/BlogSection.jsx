// src/components/BlogSection.jsx
const posts = [
  {
    title: 'Bitcoin is innovative payment network and a new kind of money',
    img: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1600&auto=format&fit=crop',
    tag: 'Bitcoin',
    author: 'Abdullah Haron',
    date: '13-Dec-2023',
  },
  {
    title: 'Workshop recap: Intro to Web3 wallets',
    img: 'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1200&auto=format&fit=crop',
    tag: 'Workshop',
    author: 'Team CSS',
    date: '10-Dec-2023',
  },
  {
    title: 'Guest talk: Scaling Layer-2 Rollups',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    tag: 'Talk',
    author: 'Dept. of CS',
    date: '07-Dec-2023',
  },
]

export default function BlogSection() {
  const [featured, ...side] = posts

  return (
    <section id="compulink" className="section py-12 md:py-16">
      <h2 className="section-title text-center">CompuLink</h2>

      {/* Set a shared height for md+ so left == (right top + right bottom) */}
      <div
        className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr] items-stretch"
        style={{ '--blogH': '460px' }} // tweak this to match your design
      >
        {/* FEATURED (large, text overlay below image) */}
        <article className="card p-0 overflow-hidden md:h-[var(--blogH)]">
          <div className="relative h-full">
            <img
              src={featured.img}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute left-4 right-4 bottom-4">
              <div className="text-xs uppercase text-white/80 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white text-black">{featured.tag}</span>
                {featured.date} · {featured.author}
              </div>
              <h3 className="mt-2 text-lg md:text-2xl font-bold max-w-3xl">
                {featured.title}
              </h3>
              <a className="btn mt-3" href="/compulink">Read More</a>
            </div>
          </div>
        </article>

        {/* SIDEBAR (two small, horizontal layout) */}
        <div className="grid gap-6 md:grid-rows-2">
          {side.map((p, idx) => (
            <article
              key={idx}
              className="card p-0 overflow-hidden flex md:h-[calc(var(--blogH)/2)]"
            >
              <img
                src={p.img}
                alt={p.title}
                className="w-40 md:w-44 lg:w-48 h-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-[11px] uppercase text-white/70 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white text-black">{p.tag}</span>
                  {p.date} · {p.author}
                </div>
                <h3 className="mt-1 font-semibold leading-snug">{p.title}</h3>
                <div className="mt-auto pt-3">
                  <a className="btn-ghost" href="/compulink">Read More</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
