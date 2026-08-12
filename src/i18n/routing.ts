import { defineRouting } from 'next-intl/routing';

/**
 * Central locale routing configuration for the application.
 *
 * Defines the supported locales and the default locale used when
 * no locale can be determined from the request path or preferences.
 * Currently only English (`en`) is enabled; additional locales can
 * be registered here without changing page components.
 */
export const routing = defineRouting({
  // Added/Modified by Rajarshi for TBD — START
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // Added/Modified by Rajarshi for TBD — END
});
