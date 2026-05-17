// src/app/gallery/page.jsx
export default function GalleryPage() {
  const images = Array.from({ length: 12 }).map((_, i) => ({
    url: `https://picsum.photos/seed/gallery${i}/800/600`,
    title: ['Event Registration', 'Coding Competition', 'Tech Talk Session', 'Group Photo 2024', 'Workshop Demo', 'Lab Session', 'Gaming Tournament', 'Seminar Hall', 'CSS Team', 'Innovation Lab', 'Networking Coffee', 'Award Ceremony'][i]
  }))

  return (
    <div className="section py-12 md:py-20">
      <div className="max-w-2xl">
        <span className="label">Moments</span>
        <h1 className="section-title mt-2">Society Gallery</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          Capturing the spirit of innovation, collaboration, and learning at the Computer Science Society. 
          A visual record of our most memorable events and workshops.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <figure key={idx} className="card p-0 group overflow-hidden relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="label text-white text-[10px]">{img.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}