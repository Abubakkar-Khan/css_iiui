// src/components/EventCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { optimizeImageUrl } from '@/lib/images';

export default function EventCard({ event, index, onEdit, onDelete }) {
  const imageUrl = event.images?.[0]?.url || event.img || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop';
  
  // Format the date if it's not pre-formatted
  const formattedDate = event.date 
    ? (event.date.includes?.(',') || (typeof event.date === 'string' && event.date.split(' ').length > 2)
        ? event.date 
        : new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' }))
    : 'Upcoming';

  // Format description into plaintext snippet
  const plainDescription = event.description 
    ? event.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
    : (event.excerpt || 'Explore scheduled society events and hands-on developer training.');

  const isAdmin = !!(onEdit || onDelete);

  return (
    <article className="card flex flex-col group/card overflow-hidden bg-surface h-full border border-border justify-between hover:border-zinc-700/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div>
        {/* Square Image Container */}
        <div className="overflow-hidden aspect-square border-b border-border relative bg-black/20">
          <Image
            src={optimizeImageUrl(imageUrl, 400, 400)}
            alt={event.title}
            width={400}
            height={400}
            className="h-full w-full object-cover brightness-95 transition-transform duration-700 group-hover/card:scale-105"
            draggable={false}
            loading="lazy"
          />
          {index !== undefined && (
            <div className="absolute top-3 left-3 font-mono text-[8px] tracking-wider uppercase bg-black/80 text-zinc-300 px-2 py-0.5 border border-white/10 backdrop-blur-sm opacity-90">
              Event {index + 1}
            </div>
          )}
        </div>

        {/* Details Block */}
        <div className="p-5 text-left">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest font-semibold block">
              {formattedDate}
            </span>
            {event.eventType && (
              <span className="text-[8px] font-mono text-white/80 bg-white/10 px-2 py-0.5 uppercase tracking-widest border border-white/5 font-semibold">
                {event.eventType}
              </span>
            )}
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-tight text-white group-hover/card:text-muted transition-colors leading-tight line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-2 text-[11px] text-muted/80 leading-relaxed font-medium line-clamp-2">
            {plainDescription}
          </p>
        </div>
      </div>

      {/* Footer Block */}
      <div className="p-5 pt-0">
        {isAdmin ? (
          <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <div className="pt-3 border-t border-border/40">
            <Link
              href={`/events/${event.id}`}
              className="w-full text-center text-[10px] font-mono font-bold uppercase tracking-widest block py-2.5 bg-fg text-bg border border-fg hover:bg-transparent hover:text-fg transition-all duration-300"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
