import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Locale-aware navigation helpers wrapped around Next.js App Router APIs.
 *
 * Prefer these exports (`Link`, `redirect`, `usePathname`, `useRouter`,
 * `getPathname`) over the Next.js equivalents so locale prefixes are
 * applied consistently with {@link routing}.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  // Added/Modified by Rajarshi for TBD
  createNavigation(routing);
