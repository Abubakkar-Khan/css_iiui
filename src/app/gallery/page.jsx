export default function GalleryPage(){
  const images = Array.from({length:12}).map((_,i)=> `https://picsum.photos/seed/gallery${i}/800/600`)
  return (
    <div className="section py-12 md:py-16">
      <h1 className="section-title">Gallery</h1>
      <p className="text-white/70 mt-2">Event memories and campus moments.</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src,idx)=> (
          <figure key={idx} className="relative overflow-hidden rounded-lg border border-white/10">
            <img src={src} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"/>
          </figure>
        ))}
      </div>
    </div>
  )
}
// ```jsx
// import TimelineSection from '@/components/TimelineSection'
// export default function AboutPage(){
//   return (<div className="section py-12 md:py-16" id="join">
//     <h1 className="section-title">About</h1>
//     <p className="mt-4 text-white/80 max-w-3xl">Mission statement goes here.</p>
//     <TimelineSection/>
//     <div className="mt-8"><a className="btn" href="#">Join Us</a></div>
//   </div>)
// }