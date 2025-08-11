export default function EventsSection({ items=[] }){
  const events = items.length? items : Array.from({length:4}).map(()=>({
    title:'IT Department Orientation 2024', date:'2 Sep 2024', img:'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop', excerpt:'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }))
  return (
    <section id="events" className="section py-12 md:py-16">
      <h2 className="section-title text-center">Events</h2>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((e,idx)=> (
          <article key={idx} className="card flex flex-col">
            <img src={e.img} alt="event" className="rounded-lg mb-4 aspect-[4/3] object-cover"/>
            <div className="text-xs uppercase text-white/70">{e.date}</div>
            <h3 className="mt-1 font-bold">{e.title}</h3>
            <p className="mt-2 text-sm text-white/80">{e.excerpt}</p>
            <div className="mt-4"><a className="btn-ghost" href="/events">Read More</a></div>
          </article>
        ))}
      </div>
    </section>
  )
}