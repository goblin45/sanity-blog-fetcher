import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Per-request internationalization configuration for Server Components.
 *
 * Resolves the active locale from the `[locale]` segment (via
 * `requestLocale`), falls back to the default locale when the
 * requested value is unsupported, and loads the matching message
 * dictionary from `messages/{locale}.json`.
 *
 * @returns Request-scoped locale and messages for `next-intl`.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Added/Modified by Rajarshi for TBD — START
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
  // Added/Modified by Rajarshi for TBD — END
});
