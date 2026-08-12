import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlogCard } from '@/components/blog/BlogCard';
import { Link } from '@/i18n/navigation';
import { SANITY_REVALIDATE_SECONDS } from '@/lib/sanity/revalidate';
import { blogService } from '@/modules/blog/blog.service';

/** ISR window for this route; keep aligned with Sanity fetch `next.revalidate`. */
export const revalidate = SANITY_REVALIDATE_SECONDS;

interface HomePageProps {
  /** Dynamic route params; `locale` is resolved asynchronously. */
  params: Promise<{ locale: string }>;
}

/**
 * Generates localized metadata for the home page using the active locale's
 * message dictionary.
 *
 * @param props - Page props containing the locale route param.
 * @returns Metadata title and description for the home page.
 */
export async function generateMetadata({ params }: HomePageProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.HomePage' });

  return {
    title: t('title'),
    description: t('description'),
  };
  // Added/Modified by Rajarshi for TBD — END
}

/**
 * Public home page that lists Sanity blog posts as interactive cards.
 *
 * @param props - Page props containing the locale route param.
 * @returns The localized blog listing UI.
 */
export default async function HomePage({ params }: HomePageProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');
  const blogs = await blogService.getBlogs();

  return (
    <div className="bg-muted flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg leading-8">
            {t('description')}
          </p>
          <Link
            href="/pdfs"
            className="text-foreground mt-4 inline-flex text-sm font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t('pdfsLink')}
          </Link>
        </header>

        {blogs.length === 0 ? (
          <p className="text-muted-foreground text-base">{t('blog.empty')}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {blogs.map((post) => (
              <li key={post._id}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
  // Added/Modified by Rajarshi for TBD — END
}
