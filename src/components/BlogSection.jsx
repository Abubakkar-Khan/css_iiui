// src/components/BlogSection.jsx
const posts = [
  {
    title: 'Bitcoin is innovative payment network and a new kind of money',
    img: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1600&auto=format&fit=crop',
    tag: 'Bitcoin',
    author: 'Abubakkar Khan',
    date: '12-dec-2025',
    excerpt:
      "I wasn't able to generate the updated diagram due to an error. Please try again or let me know if you'd like me to ...",
  },
  {
    title: 'Workshop recap: Intro to Web3 wallets',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
    tag: 'Workshop',
    author: 'Abubakkar Khan',
    date: '10-dec-2025',
    excerpt:
      'Brief recap and key takeaways from the hands-on wallet session held last week.',
  },
  {
    title: 'Guest talk: Scaling Layer-2 Rollups',
    img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop',
    tag: 'Talk',
    author: 'Dept. of CS',
    date: '07-dec-2025',
    excerpt:
      'Highlights from our guest lecture on scalability, security tradeoffs, and roadmaps.',
  },
]

export default function BlogSection() {
  const [featured, ...side] = posts

  return (
    <section id="compulink" className="section py-12 md:py-16">
      <h2 className="section-title text-center">CompuLink</h2>

      {/* 50/50 columns on md+ */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 items-stretch">
        {/* LEFT — big vertical card (fixed column height; image top, text below) */}
        <article className="card p-0 overflow-hidden md:h-[540px] flex flex-col">
          {/* Image takes ~58% on md+, fixed on mobile */}
          <div className="relative w-full h-64 md:h-[58%]">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
            <span className="absolute left-3 bottom-3 bg-white text-black text-sm px-2 py-1 rounded">
              {featured.tag}
            </span>
          </div>

          {/* Text area grows and keeps button visible */}
          <div className="p-4 md:p-5 flex-1 min-w-0 flex flex-col overflow-hidden">
            <div className="text-xs uppercase text-white/70 flex items-center gap-4 truncate">
              <span>{featured.date}</span>
              <span>{featured.author}</span>
            </div>
            {/* Let the heading wrap freely (no clamp) */}
            <h3 className="mt-2 text-2xl font-extrabold leading-tight break-words">
              {featured.title}
            </h3>
            {/* Show excerpt only on lg+ to avoid crowding */}
            <p className="mt-3 text-white/80 hidden lg:block">
              {featured.excerpt}
            </p>
            <div className="mt-auto pt-4">
              <a className="btn" href="/compulink">Read More</a>
            </div>
          </div>
        </article>

        {/* RIGHT — two horizontal cards stacked; equal heights via flex */}
        <div className="md:h-[540px] flex flex-col gap-6">
          {side.map((p, idx) => (
            <article
              key={idx}
              className="card p-0 overflow-hidden flex items-stretch flex-1 min-h-0"
            >
              {/* Thumbnail slightly narrower to give title room */}
              <div className="relative shrink-0 w-36 md:w-44 lg:w-48 h-full">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                <span className="absolute left-2 bottom-2 bg-white text-black text-xs px-2 py-0.5 rounded">
                  {p.tag}
                </span>
              </div>

              {/* Text column (no clamps on title) */}
              <div className="p-4 md:p-5 flex-1 min-w-0 flex flex-col">
                <div className="text-[11px] uppercase text-white/70 flex items-center gap-4 truncate">
                  <span>{p.date}</span>
                  <span>{p.author}</span>
                </div>
                <h3 className="mt-1 text-lg md:text-xl font-extrabold leading-snug break-words">
                  {p.title}
                </h3>
                {/* Excerpt only on xl+ so rows stay balanced */}
                <p className="mt-2 text-white/80 hidden xl:block">
                  {p.excerpt}
                </p>
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
