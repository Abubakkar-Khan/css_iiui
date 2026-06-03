import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa6';

export default function TeamCard({ member: m }) {
  return (
    <article className="card p-0 group overflow-hidden flex flex-col justify-between h-full">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="overflow-hidden aspect-square border-b border-border">
            <img
              src={m.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400'}
              alt={m.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-5 text-center">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white bg-white/10 px-2 py-0.5 inline-block border border-white/10 rounded-none mb-2">
              {m.designation}
            </span>
            <h3 className="mt-1 text-base font-bold text-white uppercase tracking-tight truncate">{m.name}</h3>
            {m.details && (
              <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2 font-medium">{m.details}</p>
            )}
          </div>
        </div>
        {(m.linkedin || m.instagram || m.facebook) && (
          <div className="flex justify-center gap-4 py-3.5 border-t border-border bg-[#0d0f14]/50">
            {m.linkedin && (
              <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedinIn size={12} />
              </a>
            )}
            {m.instagram && (
              <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={12} />
              </a>
            )}
            {m.facebook && (
              <a href={m.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF size={12} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
