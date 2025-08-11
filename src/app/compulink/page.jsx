export default function CompuLinkPage(){
  const posts = Array.from({length:9}).map((_,i)=>({
    id:i+1,
    title:`Article ${i+1}`,
    img:`https://picsum.photos/seed/compulink${i}/800/450`,
    tag:['Research','Event','News'][i%3],
    date:'2025-08-01',
    author:['Ayesha','Hassan','Zara'][i%3]
  }))
  return (
    <div className="section py-12 md:py-16">
      <h1 className="section-title">CompuLink</h1>
      <p className="text-white/70 mt-2">Stories, blogs, and highlights from the society.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(p=> (
          <article key={p.id} className="card">
            <img src={p.img} alt={p.title} className="rounded-lg mb-3 aspect-video object-cover"/>
            <div className="text-xs uppercase text-white/70 flex items-center gap-2"><span className="px-2 py-0.5 rounded bg-white text-black">{p.tag}</span>{p.date} · {p.author}</div>
            <h3 className="mt-2 font-bold">{p.title}</h3>
            <a className="btn-ghost mt-3" href="#">Read</a>
          </article>
        ))}
      </div>
    </div>
  )
}