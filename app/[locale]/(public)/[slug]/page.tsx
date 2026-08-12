import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogImageCarousel } from '@/components/blog/BlogImageCarousel';
import { PortableTextBody } from '@/components/blog/PortableTextBody';
import { Link } from '@/i18n/navigation';
import { SANITY_REVALIDATE_SECONDS } from '@/lib/sanity/revalidate';
import { blogService } from '@/modules/blog/blog.service';

/** ISR window for this route; keep aligned with Sanity fetch `next.revalidate`. */
export const revalidate = SANITY_REVALIDATE_SECONDS;

interface BlogPostPageProps {
  /** Dynamic route params; `locale` and `slug` resolve asynchronously. */
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Builds static params for every Sanity blog slug so detail routes can be
 * pre-rendered where possible.
 *
 * @returns An array of `{ slug }` values from Sanity.
 */
export async function generateStaticParams() {
  // Added/Modified by Rajarshi for TBD
  return blogService.getBlogSlugs();
}

/**
 * Generates SEO metadata for a blog post from its Sanity document.
 *
 * @param props - Page props containing locale and slug params.
 * @returns Metadata title and description for the post.
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  // Added/Modified by Rajarshi for TBD — START
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.BlogPost' });
  const post = await blogService.getBlogBySlug(slug);

  if (!post) {
    return {
      title: t('notFoundTitle'),
      description: t('notFoundDescription'),
    };
  }

  return {
    title: t('title', { title: post.title }),
    description: post.excerpt ?? t('fallbackDescription', { title: post.title }),
  };
  // Added/Modified by Rajarshi for TBD — END
}

/**
 * Public blog detail page that loads a Sanity `post` by slug and renders its
 * Portable Text body.
 *
 * @param props - Page props containing locale and slug params.
 * @returns The localized blog post UI, or a 404 when the slug is unknown.
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('BlogPost');
  const post = await blogService.getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-muted flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-muted-foreground mb-8 inline-flex text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t('backToList')}
        </Link>

        <article>
          <header className="mb-10">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
          </header>

          {post.carouselImages && post.carouselImages.length > 0 ? (
            <BlogImageCarousel images={post.carouselImages} />
          ) : null}

          {post.body && post.body.length > 0 ? (
            <div className="border-border bg-background border px-6 py-8 sm:px-10">
              <PortableTextBody value={post.body} />
            </div>
          ) : (
            <p className="text-muted-foreground text-base">{t('emptyBody')}</p>
          )}
        </article>
      </main>
    </div>
  );
  // Added/Modified by Rajarshi for TBD — END
}