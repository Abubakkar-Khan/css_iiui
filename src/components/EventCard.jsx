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
    ? event.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
    : (event.excerpt || 'Explore scheduled society events and hands-on developer training.');

  const isAdmin = !!(onEdit || onDelete);

  return (
    <article className="card flex flex-col group/card overflow-hidden bg-surface h-full border border-border justify-between hover:border-zinc-700 transition-all duration-300">
      <div>
        {/* Aspect Ratio Image Container */}
        <div className="overflow-hidden aspect-video border-b border-border relative bg-black/20">
          <Image
            src={optimizeImageUrl(imageUrl, 500, 280)}
            alt={event.title}
            width={500}
            height={280}
            className="h-full w-full object-cover brightness-95 transition-transform duration-700 group-hover/card:scale-103"
            draggable={false}
            loading="lazy"
          />
        </div>

        {/* Content Block */}
        <div className="p-6 text-left space-y-3">
          <div className="text-xs md:text-sm font-mono text-muted uppercase tracking-widest font-black">
            {formattedDate} {event.eventType && `• ${event.eventType}`}
          </div>
          
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white leading-tight line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-sm md:text-base text-muted/95 leading-relaxed font-semibold line-clamp-2">
            {plainDescription}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        {isAdmin ? (
          <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="text-xs md:text-sm font-mono font-black uppercase tracking-widest text-muted hover:text-white transition-colors cursor-pointer"
              >
                [ Edit ]
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="text-xs md:text-sm font-mono font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                [ Delete ]
              </button>
            )}
          </div>
        ) : (
          <div className="pt-4 border-t border-border/40">
            <Link
              href={`/events/${event.id}`}
              className="w-full text-center text-xs md:text-sm font-mono font-black uppercase tracking-widest block py-3 bg-white text-black hover:bg-transparent hover:text-white border border-white transition-all duration-300"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

