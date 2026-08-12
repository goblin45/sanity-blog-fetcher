import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DearFlipViewer } from '@/components/pdf/DearFlipViewer';
import { Link } from '@/i18n/navigation';
import { SANITY_REVALIDATE_SECONDS } from '@/lib/sanity/revalidate';
import { pdfService } from '@/modules/pdf/pdf.service';
import { resolvePdfUrl } from '@/types/pdf';

/** ISR window for this route; keep aligned with Sanity fetch `next.revalidate`. */
export const revalidate = SANITY_REVALIDATE_SECONDS;

interface PdfViewerPageProps {
  /** Dynamic route params; `locale` and `id` resolve asynchronously. */
  params: Promise<{ locale: string; id: string }>;
}

/**
 * Builds static params for every Sanity PDF `_id`.
 *
 * @returns An array of `{ id }` values from Sanity.
 */
export async function generateStaticParams() {
  // Added/Modified by Rajarshi for TBD
  return pdfService.getPdfIds();
}

/**
 * Generates SEO metadata for a PDF viewer page.
 *
 * @param props - Page props containing locale and id params.
 * @returns Metadata title and description.
 */
export async function generateMetadata({
  params,
}: PdfViewerPageProps): Promise<Metadata> {
  // Added/Modified by Rajarshi for TBD — START
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.PdfViewer' });
  const pdf = await pdfService.getPdfById(id);

  if (!pdf) {
    return {
      title: t('notFoundTitle'),
      description: t('notFoundDescription'),
    };
  }

  return {
    title: t('title', { title: pdf.title }),
    description: t('description', { title: pdf.title }),
  };
  // Added/Modified by Rajarshi for TBD — END
}

/**
 * Renders a Sanity PDF in DearFlip using the document's CDN / asset URL.
 *
 * @param props - Page props containing locale and id params.
 * @returns The flipbook viewer UI, or a 404 when the PDF is missing.
 */
export default async function PdfViewerPage({ params }: PdfViewerPageProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('PdfViewer');
  const pdf = await pdfService.getPdfById(id);

  if (!pdf) {
    notFound();
  }

  const pdfUrl = resolvePdfUrl(pdf);

  return (
    <div className="bg-muted flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/pdfs"
          className="text-muted-foreground mb-8 inline-flex text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t('backToList')}
        </Link>

        <header className="mb-8">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            {pdf.title}
          </h1>
          {pdf.filename ? (
            <p className="text-muted-foreground mt-2 text-sm">{pdf.filename}</p>
          ) : null}
        </header>

        {pdfUrl ? (
          <div className="border-border bg-background border p-2 sm:p-4">
            <DearFlipViewer
              pdfUrl={pdfUrl}
              title={pdf.title}
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-base">{t('missingFile')}</p>
        )}
      </main>
    </div>
  );
  // Added/Modified by Rajarshi for TBD — END
}
