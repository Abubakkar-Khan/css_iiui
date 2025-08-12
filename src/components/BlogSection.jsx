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
    title: 'Bitcoin is innovative payment network and a new kind of money',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
    tag: 'Bitcoin',
    author: 'Abubakkar Khan',
    date: '12-dec-2025',
    excerpt:
      "I wasn't able to generate the updated diagram due to an error. Please try again or let me know if you'd like me to ...",
  },
  {
    title: 'Bitcoin is innovative payment network and a new kind of money',
    img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop',
    tag: 'Bitcoin',
    author: 'Abubakkar Khan',
    date: '12-dec-2025',
    excerpt:
      "I wasn't able to generate the updated diagram due to an error. Please try again or let me know if you'd like me to ...",
  },
]

export default function BlogSection() {
  const [featured, ...side] = posts

  return (
    <section id="compulink" className="section py-12 md:py-16">
      <h2 className="section-title text-center">CompuLink</h2>

      {/* On md+, 50/50 columns. Adjust --blogH to match the mock height */}
      <div
        className="mt-8 grid gap-6 md:grid-cols-2 items-stretch"
        style={{ '--blogH': '520px' }}
      >
        {/* LEFT: Large vertical card (takes full column height) */}
        <article className="card p-0 overflow-hidden md:h-[var(--blogH)] flex flex-col">
          {/* Image with tag badge on bottom-left */}
          <div className="relative w-full h-64 md:h-[60%]">
            <img
              src={featured.img}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute left-3 bottom-3 bg-white text-black text-sm px-2 py-1 rounded">
              {featured.tag}
            </span>
          </div>

          {/* Text content under the image */}
          <div className="p-4 md:p-5 flex-1 flex flex-col">
            <div className="text-xs uppercase text-white/70 flex items-center gap-4">
              <span>{featured.date}</span>
              <span>{featured.author}</span>
            </div>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight">
              {featured.title}
            </h3>
            <p className="mt-3 text-white/80">
              {featured.excerpt}
            </p>
            <div className="mt-auto pt-4">
              <a className="btn" href="/compulink">Read More</a>
            </div>
          </div>
        </article>

        {/* RIGHT: Two horizontal cards stacked; together match left height */}
        <div className="grid gap-6 md:grid-rows-2 md:h-[var(--blogH)]">
          {side.map((p, idx) => (
            <article
              key={idx}
              className="card p-0 overflow-hidden flex items-stretch md:h-full"
            >
              {/* Thumb left */}
              <div className="relative shrink-0 w-40 md:w-48 lg:w-56 h-full">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute left-2 bottom-2 bg-white text-black text-xs px-2 py-0.5 rounded">
                  {p.tag}
                </span>
              </div>

              {/* Text right */}
              <div className="p-4 md:p-5 flex-1 flex flex-col">
                <div className="text-[11px] uppercase text-white/70 flex items-center gap-4">
                  <span>{p.date}</span>
                  <span>{p.author}</span>
                </div>
                <h3 className="mt-1 text-xl font-extrabold leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-white/80 hidden sm:block">
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
