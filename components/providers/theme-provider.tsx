'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Application-root theme provider that wraps `next-themes`.
 *
 * Release 1 locks the document to light via `forcedTheme`. Dark remains in
 * `themes` as provision for a later release; remove `forcedTheme` (and
 * re-enable system preference if desired) when dark styles ship. Must be
 * rendered inside `<body>` with `suppressHydrationWarning` on `<html>`.
 *
 * @param props - Props forwarded to `next-themes` `ThemeProvider`, including
 *   `children` and any configuration overrides.
 * @returns The themed React subtree.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Added/Modified by Rajarshi for TBD — START
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      themes={['light', 'dark']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
  // Added/Modified by Rajarshi for TBD — END
}
