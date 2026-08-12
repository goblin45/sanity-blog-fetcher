/**
 * Env var that holds the canonical production origin for the website
 * (for example `https://www.example.com`). Used by sitemap, robots, and
 * other SEO helpers that must emit absolute URLs.
 */
// Added/Modified by Rajarshi for TBD
export const SITE_URL_ENV_KEY = 'NEXT_PUBLIC_SITE_URL' as const;

/**
 * Resolves the canonical site origin used for absolute SEO URLs.
 *
 * Reads {@link SITE_URL_ENV_KEY} and strips a trailing slash so callers
 * can safely concatenate path segments. Falls back to `http://localhost:3000`
 * during local development when the env var is unset.
 *
 * @returns The absolute site origin without a trailing slash.
 * @throws {Error} When the configured value is not a valid absolute URL.
 */
export function getSiteUrl(): string {
  // Added/Modified by Rajarshi for TBD — START
  const configuredUrl = process.env[SITE_URL_ENV_KEY]?.trim();
  const siteUrl = configuredUrl || 'http://localhost:3000';

  try {
    return new URL(siteUrl).origin;
  } catch {
    throw new Error(
      `Invalid ${SITE_URL_ENV_KEY} value "${siteUrl}". Expected an absolute URL such as https://www.example.com.`,
    );
  }
  // Added/Modified by Rajarshi for TBD — END
}
