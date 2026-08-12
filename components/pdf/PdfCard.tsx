import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { resolvePdfUrl, type SanityPdf } from '@/types/pdf';

interface PdfCardProps {
  /** Sanity PDF document summary. */
  pdf: SanityPdf;
}

/**
 * Interactive listing card that links to the DearFlip PDF viewer route.
 *
 * @param props - Card props including the PDF document.
 * @returns A linked card for one PDF.
 */
export async function PdfCard({ pdf }: PdfCardProps) {
  // Added/Modified by Rajarshi for TBD — START
  const t = await getTranslations('PdfList');
  const url = resolvePdfUrl(pdf);

  return (
    <article className="border-border bg-background flex h-full flex-col border p-6 transition-colors hover:bg-muted/40">
      <h2 className="text-foreground text-xl font-semibold tracking-tight">
        <Link
          href={`/pdfs/${pdf._id}`}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {pdf.title}
        </Link>
      </h2>
      {pdf.filename ? (
        <p className="text-muted-foreground mt-3 flex-1 text-sm leading-6">
          {pdf.filename}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
        <Link
          href={`/pdfs/${pdf._id}`}
          className="text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t('openFlipbook')}
        </Link>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t('openRaw')}
          </a>
        ) : null}
      </div>
    </article>
  );
  // Added/Modified by Rajarshi for TBD — END
}
