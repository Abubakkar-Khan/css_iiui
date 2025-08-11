const milestones=[
  { year:2024, text:'Orientation, workshops, and new club onboarding.' },
  { year:2024, text:'Hackathon and research symposium highlights.' },
  { year:2024, text:'Community outreach and CS for schools.' },
  { year:2024, text:'Industry talks and alumni night.' },
]
export default function TimelineSection(){
  return (
    <section id="about" className="section py-12 md:py-16">
      <h2 className="section-title text-center">Timeline</h2>
      <div className="mt-8">
        <div className="relative">
          <div className="h-1 bg-white/10 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {milestones.map((m,idx)=> (
              <div key={idx} className="card">
                <div className="text-xs uppercase text-white/60">{m.year}</div>
                <p className="mt-2 text-sm text-white/80">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}