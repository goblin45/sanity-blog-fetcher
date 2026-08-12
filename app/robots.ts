import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/seo/site';

/**
 * Generates the site-wide `robots.txt` rules for search engine crawlers.
 *
 * Allows indexing of public pages by default and points crawlers at the
 * generated sitemap. Extend `disallow` when non-indexable routes
 * (admin, auth, previews) are introduced.
 *
 * @returns Robots metadata served by Next.js at `/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  // Added/Modified by Rajarshi for TBD — START
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
  // Added/Modified by Rajarshi for TBD — END
}
