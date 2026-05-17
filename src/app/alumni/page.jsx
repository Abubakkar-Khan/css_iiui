// src/app/alumni/page.jsx
import { FaLinkedinIn } from 'react-icons/fa6'

const alumni = [
  {
    name: 'Ahmad Raza',
    gradYear: '2020',
    batch: 'F16',
    company: 'Google',
    role: 'Software Engineer',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Fatima Noor',
    gradYear: '2019',
    batch: 'F15',
    company: 'Microsoft',
    role: 'Product Manager',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Hassan Ali',
    gradYear: '2021',
    batch: 'F17',
    company: 'Amazon',
    role: 'DevOps Engineer',
    img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Zainab Malik',
    gradYear: '2018',
    batch: 'F14',
    company: 'Meta',
    role: 'Data Scientist',
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Usman Sheikh',
    gradYear: '2022',
    batch: 'F18',
    company: 'Careem',
    role: 'Frontend Developer',
    img: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Sana Tariq',
    gradYear: '2020',
    batch: 'F16',
    company: 'Systems Limited',
    role: 'Backend Engineer',
    img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Bilal Khan',
    gradYear: '2017',
    batch: 'F13',
    company: 'Arbisoft',
    role: 'Team Lead',
    img: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Ayesha Iqbal',
    gradYear: '2023',
    batch: 'F19',
    company: 'Netsol Technologies',
    role: 'Software Engineer',
    img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
]

export default function AlumniPage() {
  return (
    <div className="section py-12 md:py-24">
      <div className="max-w-2xl mb-16">
        <span className="label">Alumni Network</span>
        <h1 className="section-title mt-4 font-black leading-tight uppercase">
          Inspiring IIUI Minds
        </h1>
        <p className="mt-2 text-white/70 font-semibold text-lg md:text-xl tracking-tight">
          Connect, Learn & Thrive!
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {alumni.map((person, idx) => (
          <article
            key={idx}
            className="card p-4 flex flex-col group border-white/5 hover:border-white/20 transition-all duration-300"
          >
            <div className="relative overflow-hidden aspect-square border border-white/10 mb-4 bg-black">
              <img
                src={person.img}
                alt={person.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
            </div>

            <div className="flex-1 flex flex-col">
              <span className="label text-[9px] mb-2">[ {person.batch} ] • Class of {person.gradYear}</span>
              <h3 className="text-md font-black uppercase tracking-tight text-white group-hover:text-white transition-colors">
                {person.name}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed font-medium">
                {person.role} <span className="text-white/30">@</span> {person.company}
              </p>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors"
                >
                  <FaLinkedinIn className="text-xs" aria-hidden="true" />
                  Connect Profile
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
