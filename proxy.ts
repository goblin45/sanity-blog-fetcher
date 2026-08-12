import createMiddleware from 'next-intl/middleware';

import { routing } from './src/i18n/routing';

/**
 * Next.js proxy (formerly middleware) that negotiates locales and rewrites
 * unprefixed paths to the default locale.
 *
 * For example, a request to `/about` is redirected to `/en/about` because
 * `en` is the site default locale and `localePrefix` is set to `always`.
 */
export default createMiddleware(routing);

/**
 * Matcher that runs the i18n proxy on application routes while skipping
 * API handlers, framework internals, and static assets.
 */
export const config = {
  // Added/Modified by Rajarshi for TBD
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
