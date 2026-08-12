import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import type { BlogPostSummary } from '@/types/blog';

interface BlogCardProps {
  /** Blog post summary displayed in the card. */
  post: BlogPostSummary;
}

/**
 * Interactive blog listing card that links to the post detail route.
 *
 * @param props - Card props including the post summary.
 * @returns A linked card for one blog post.
 */
export async function BlogCard({ post }: BlogCardProps) {
  // Added/Modified by Rajarshi for TBD — START
  const t = await getTranslations('HomePage.blog');

  return (
    <article className="border-border bg-background flex h-full flex-col border p-6 transition-colors hover:bg-muted/40">
      <h2 className="text-foreground text-xl font-semibold tracking-tight">
        <Link
          href={`/${post.slug}`}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? (
        <p className="text-muted-foreground mt-3 flex-1 text-sm leading-6">
          {post.excerpt}
        </p>
      ) : null}
      <Link
        href={`/${post.slug}`}
        className="text-foreground mt-6 inline-flex text-sm font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {t('readMore')}
      </Link>
    </article>
  );
  // Added/Modified by Rajarshi for TBD — END
}
