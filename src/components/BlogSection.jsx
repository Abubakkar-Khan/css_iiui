const posts=Array.from({length:3}).map(()=>({ title:'Bitcoin is innovative payment network and a new kind of money', img:'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop', tag:'Bitcoin', author:'Abdullah Haron', date:'13-Dec-2023' }))
export default function BlogSection(){
  return (
    <section id="gallery" className="section py-12 md:py-16">
      <h2 className="section-title text-center">CompuLink</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {posts.map((p,idx)=> (
          <article key={idx} className="card">
            <img src={p.img} alt="blog" className="rounded-lg mb-4 aspect-video object-cover"/>
            <div className="text-xs uppercase text-white/70 flex items-center gap-2"><span className="px-2 py-0.5 rounded bg-white text-black">{p.tag}</span>{p.date} · {p.author}</div>
            <h3 className="mt-2 font-bold">{p.title}</h3>
            <div className="mt-4"><a className="btn" href="#">Read More</a></div>
          </article>
        ))}
      </div>
    </section>
  )
}