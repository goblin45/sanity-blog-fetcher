import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PdfCard } from '@/components/pdf/PdfCard';
import { Link } from '@/i18n/navigation';
import { SANITY_REVALIDATE_SECONDS } from '@/lib/sanity/revalidate';
import { pdfService } from '@/modules/pdf/pdf.service';

/** ISR window for this route; keep aligned with Sanity fetch `next.revalidate`. */
export const revalidate = SANITY_REVALIDATE_SECONDS;

interface PdfListPageProps {
  /** Dynamic route params; `locale` is resolved asynchronously. */
  params: Promise<{ locale: string }>;
}

/**
 * Generates localized metadata for the PDF listing page.
 *
 * @param props - Page props containing the locale route param.
 * @returns Metadata title and description.
 */
export async function generateMetadata({ params }: PdfListPageProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.PdfList' });

  return {
    title: t('title'),
    description: t('description'),
  };
  // Added/Modified by Rajarshi for TBD — END
}

/**
 * Lists Sanity `pdf` documents with links into the DearFlip viewer.
 *
 * @param props - Page props containing the locale route param.
 * @returns The PDF listing UI.
 */
export default async function PdfListPage({ params }: PdfListPageProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('PdfList');
  const pdfs = await pdfService.getPdfs();

  return (
    <div className="bg-muted flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-muted-foreground mb-8 inline-flex text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t('backToBlog')}
        </Link>

        <header className="mb-10 max-w-2xl">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg leading-8">
            {t('description')}
          </p>
        </header>

        {pdfs.length === 0 ? (
          <p className="text-muted-foreground text-base">{t('empty')}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pdfs.map((pdf) => (
              <li key={pdf._id}>
                <PdfCard pdf={pdf} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
  // Added/Modified by Rajarshi for TBD — END
}
