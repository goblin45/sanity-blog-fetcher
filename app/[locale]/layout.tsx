import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface LocaleLayoutProps {
  /** Nested route segments for the active locale. */
  children: ReactNode;
  /** Dynamic route params; `locale` is resolved asynchronously. */
  params: Promise<{ locale: string }>;
}

/**
 * Builds the static params for every supported locale so locale routes
 * can be pre-rendered at build time.
 *
 * @returns An array of `{ locale }` params covering {@link routing.locales}.
 */
export function generateStaticParams() {
  // Added/Modified by Rajarshi for TBD
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Locale-scoped document layout that validates the `[locale]` segment,
 * enables static rendering via `setRequestLocale`, and provides messages
 * to Client Components through `NextIntlClientProvider`.
 *
 * @param props - Locale layout props including children and route params.
 * @returns The localized HTML document shell for the matched locale.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
  // Added/Modified by Rajarshi for TBD — END
}
