import db from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { optimizeImageUrl } from '@/lib/images';

export const revalidate = 0;

export default async function NewsDetailPage({ params }) {
  const { id } = await params;
  const numId = Number(id);

  let article = null;

  if (Number.isFinite(numId)) {
    try {
      const res = await db.query('SELECT * FROM "News" WHERE "id" = $1', [numId]);
      if (res.rows.length > 0) {
        article = res.rows[0];
      }
    } catch (err) {
      console.error('News detail DB error:', err);
    }
  }

  if (!article) {
    return (
      <div className="section section-pad text-center">
        <h1 className="section-title mb-4">Article Not Found</h1>
        <p className="text-muted text-sm mb-8">The news article you are looking for does not exist or has been removed.</p>
        <Link href="/" className="btn">Back to Home</Link>
      </div>
    );
  }

  const formattedDate = new Date(article.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="section section-pad">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-white transition-colors mb-10"
      >
        ← Back to Home
      </Link>

      <article className="max-w-3xl mx-auto">
        {/* Date */}
        <span className="label mb-4">{formattedDate}</span>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white mt-4">
          {article.title}
        </h1>

        {/* Cover Image */}
        {article.imageUrl && (
          <div className="mt-10 border border-border overflow-hidden">
            <Image
              src={optimizeImageUrl(article.imageUrl, 1200)}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Body */}
        <div className="mt-10 text-sm md:text-base text-[var(--fg)] leading-relaxed whitespace-pre-line">
          {article.details}
        </div>
      </article>
    </div>
  );
}
