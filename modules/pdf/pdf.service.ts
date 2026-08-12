import { logger } from '@/lib/logging/logger';
import { sanityClient } from '@/lib/sanity/client';
import {
  PDF_BY_ID_QUERY,
  PDF_IDS_QUERY,
  PDFS_QUERY,
} from '@/lib/sanity/queries';
import { SANITY_REVALIDATE_SECONDS } from '@/lib/sanity/revalidate';
import type { SanityPdf } from '@/types/pdf';

/**
 * Next.js fetch cache options shared with blog Sanity reads.
 */
const sanityFetchOptions = {
  next: { revalidate: SANITY_REVALIDATE_SECONDS },
} as const;

/**
 * Read-only PDF service that loads Sanity `pdf` documents for DearFlip pages.
 */
// Added/Modified by Rajarshi for TBD — START
export const pdfService = {
  /**
   * Fetches every Sanity PDF document for the listing page.
   *
   * @returns PDF documents ordered by title.
   */
  async getPdfs(): Promise<SanityPdf[]> {
    try {
      const pdfs = await sanityClient.fetch<SanityPdf[]>(
        PDFS_QUERY,
        {},
        sanityFetchOptions,
      );

      console.log('[sanity] getPdfs', JSON.stringify(pdfs, null, 2));
      return pdfs;
    } catch (error) {
      logger.error('Failed to fetch Sanity PDFs', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },

  /**
   * Fetches a single PDF document by Sanity `_id`.
   *
   * @param id - Document `_id`.
   * @returns The matching PDF, or `null` when missing.
   */
  async getPdfById(id: string): Promise<SanityPdf | null> {
    try {
      const pdf = await sanityClient.fetch<SanityPdf | null>(
        PDF_BY_ID_QUERY,
        { id },
        sanityFetchOptions,
      );

      console.log('[sanity] getPdfById', id, JSON.stringify(pdf, null, 2));
      return pdf;
    } catch (error) {
      logger.error('Failed to fetch Sanity PDF by id', {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },

  /**
   * Returns id params for static generation of PDF viewer routes.
   *
   * @returns An array of `{ id }` objects for `generateStaticParams`.
   */
  async getPdfIds(): Promise<{ id: string }[]> {
    try {
      const docs = await sanityClient
        .withConfig({ useCdn: false })
        .fetch<{ _id: string }[]>(PDF_IDS_QUERY);

      return docs.map((doc) => ({ id: doc._id }));
    } catch (error) {
      logger.error('Failed to fetch Sanity PDF ids', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
};
// Added/Modified by Rajarshi for TBD — END
