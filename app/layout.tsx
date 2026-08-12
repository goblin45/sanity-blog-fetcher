import type { ReactNode } from 'react';

import './globals.css';

interface RootLayoutProps {
  /** Nested route segments rendered by the App Router. */
  children: ReactNode;
}

/**
 * Root application layout required by the Next.js App Router.
 *
 * Locale-specific markup (`html` / `body`) lives in
 * `app/[locale]/layout.tsx`. This root layout only loads global styles
 * and forwards children so the `[locale]` segment can own document structure.
 *
 * @param props - Layout props containing nested route children.
 * @returns The nested route tree without wrapping document tags.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // Added/Modified by Rajarshi for TBD
  return children;
}
