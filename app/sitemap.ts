import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { PUBLIC_SITEMAP_ROUTES } from '@/lib/seo/routes';
import { getSiteUrl } from '@/lib/seo/site';

/**
 * Builds absolute localized URLs (and `x-default`) for a locale-relative path.
 *
 * @param siteUrl - Canonical site origin without a trailing slash.
 * @param path - Locale-relative path; empty string represents the home page.
 * @returns A map of locale codes (plus `x-default`) to absolute URLs.
 */
function buildLanguageAlternates(siteUrl: string, path: string): Record<string, string> {
  // Added/Modified by Rajarshi for TBD — START
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = `${siteUrl}/${locale}${normalizedPath}`;
  }

  languages['x-default'] = `${siteUrl}/${routing.defaultLocale}${normalizedPath}`;

  return languages;
  // Added/Modified by Rajarshi for TBD — END
}

/**
 * Generates the production sitemap for all public, indexable locale routes.
 *
 * Only canonical URLs from {@link PUBLIC_SITEMAP_ROUTES} are included.
 * Each entry lists `hreflang` alternates for every supported locale.
 *
 * @returns Sitemap entries consumed by Next.js at `/sitemap.xml`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Added/Modified by Rajarshi for TBD — START
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_SITEMAP_ROUTES.flatMap((route) => {
    const languages = buildLanguageAlternates(siteUrl, route.path);

    return routing.locales.map((locale) => ({
      url: languages[locale],
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages,
      },
    }));
  });
  // Added/Modified by Rajarshi for TBD — END
}

// Added/Modified by Rajarshi for TBD
export const revalidate = 300; // 5 minutes
