// src/components/EventCard.jsx
import Link from 'next/link';

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
    <article className="card flex flex-col group/card overflow-hidden bg-black h-full border border-border justify-between">
      <div>
        {/* Square Image */}
        <div className="overflow-hidden aspect-square border-b border-border relative">
          <img
            src={imageUrl}
            alt={event.title}
            className="h-full w-full object-cover brightness-95 transition-all duration-500 group-hover/card:scale-105"
            draggable={false}
          />
          {index !== undefined && (
            <div className="absolute top-2 left-2 font-mono text-[7px] bg-black/85 px-1.5 py-0.5 border border-white/10 opacity-70">
              Event {index + 1}
            </div>
          )}
        </div>
        {/* Details */}
        <div className="p-4 bg-surface text-left">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-[7px] font-mono text-muted uppercase tracking-wider block">{formattedDate}</span>
            {event.eventType && (
              <span className="text-[6px] font-mono text-muted bg-border px-1.5 py-0.5 uppercase border border-border">{event.eventType}</span>
            )}
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-tight text-white line-clamp-1 group-hover/card:text-muted transition-colors leading-tight">
            {event.title}
          </h3>
          <p className="mt-1 text-[10px] text-muted leading-relaxed line-clamp-2">
            {plainDescription}
          </p>
        </div>
      </div>
      <div className="p-4 pt-0 bg-surface">
        {isAdmin ? (
          <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-500/70 hover:text-red-400 transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <div className="pt-2 border-t border-border/40">
            <Link
              href={`/events/${event.id}`}
              className="w-full text-center text-[9px] font-mono font-bold uppercase tracking-widest block py-2.5 bg-white text-black border border-white hover:bg-transparent hover:text-white transition-all duration-300"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
