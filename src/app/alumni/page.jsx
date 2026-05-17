// src/app/alumni/page.jsx
import { FaLinkedinIn } from 'react-icons/fa6'

const alumni = [
  {
    name: 'Ahmad Raza',
    gradYear: '2020',
    company: 'Google',
    role: 'Software Engineer',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Fatima Noor',
    gradYear: '2019',
    company: 'Microsoft',
    role: 'Product Manager',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Hassan Ali',
    gradYear: '2021',
    company: 'Amazon',
    role: 'DevOps Engineer',
    img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Zainab Malik',
    gradYear: '2018',
    company: 'Meta',
    role: 'Data Scientist',
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Usman Sheikh',
    gradYear: '2022',
    company: 'Careem',
    role: 'Frontend Developer',
    img: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Sana Tariq',
    gradYear: '2020',
    company: 'Systems Limited',
    role: 'Backend Engineer',
    img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Bilal Khan',
    gradYear: '2017',
    company: 'Arbisoft',
    role: 'Team Lead',
    img: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Ayesha Iqbal',
    gradYear: '2023',
    company: 'Netsol Technologies',
    role: 'Software Engineer',
    img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
  },
]

export default function AlumniPage() {
  return (
    <div className="section py-12 md:py-20">
      <div className="max-w-2xl">
        <span className="label">Alumni Network</span>
        <h1 className="section-title mt-2">Our Graduates</h1>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          The Computer Science Society takes pride in its alumni who are now making significant contributions 
          to the global technology landscape. Our network spans from local startups to global tech giants.
        </p>
      </div>

      <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {alumni.map((person, idx) => (
          <article
            key={idx}
            className="card p-0 flex flex-col group overflow-hidden"
          >
            <div className="overflow-hidden aspect-[3/4]">
              <img
                src={person.img}
                alt={person.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <span className="label text-[10px]">Class of {person.gradYear}</span>
              <h3 className="mt-2 text-base font-bold text-white">
                {person.name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {person.role} at {person.company}
              </p>

              <div className="mt-auto pt-5">
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-white transition-colors"
                >
                  <FaLinkedinIn aria-hidden="true" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
