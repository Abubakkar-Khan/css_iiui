export default function CompuLinkPage() {
  const posts = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: `The Best way to get out of Tutorial Hell`,
    img: `https://picsum.photos/seed/compulink${i}/800/450`,
    tag: ["Research", "Event", "News"][i % 3],
    date: "2025-08-01",
    author: ["Ayesha", "Hassan", "Zara"][i % 3],
  }));

  return (
    <div className="section py-12 md:py-16">
      <h1 className="section-title">CompuLink</h1>
      <p className="text-white/70 mt-2">
        Stories, blogs, and highlights from the society.
      </p>

      <div className="mt-8 space-y-6">
        {posts.map((p) => (
          <article
            key={p.id}
            className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4"
          >
            <img
              src={p.img}
              alt={p.title}
              className="rounded-lg w-full sm:w-48 h-32 object-cover"
            />

            <div className="flex-1">
              <div className="text-xs uppercase text-white/70 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white text-black">
                  {p.tag}
                </span>
                {p.date} · {p.author}
              </div>
              <h3 className="mt-2 font-bold text-lg cursor-pointer hover:underline transition-all duration-100">
                {p.title}
              </h3>
              <a className="btn-ghost mt-3 inline-block" href="#">
                Read &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
