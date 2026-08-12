/**
 * Describes a publicly indexable route that should appear in the sitemap.
 */
export interface PublicSitemapRoute {
  /**
   * Locale-relative path without a locale prefix.
   * Use an empty string for the home page.
   */
  path: string;
  /** Sitemap change-frequency hint for crawlers. */
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** Relative priority from 0.0 to 1.0. */
  priority: number;
}

/**
 * Canonical list of public, indexable routes included in `sitemap.xml`.
 *
 * Keep this list synchronized with public App Router pages. Do not include
 * authentication, admin, preview, or otherwise non-indexable routes.
 */
export const PUBLIC_SITEMAP_ROUTES: readonly PublicSitemapRoute[] = [
  // Added/Modified by Rajarshi for TBD — START
  {
    path: '',
    changeFrequency: 'daily',
    priority: 1,
  },
  // Added/Modified by Rajarshi for TBD — END
];
