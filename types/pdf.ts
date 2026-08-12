/**
 * Sanity PDF document used by the DearFlip viewer.
 */
export interface SanityPdf {
  _id: string;
  title: string;
  /** Preferred CDN URL from the Studio `cdnUrl` field, when present. */
  cdnUrl: string | null;
  /** Asset URL from `file.asset->url`. */
  fileUrl: string | null;
  filename: string | null;
}

/**
 * Resolves the best available public URL for a Sanity PDF document.
 *
 * @param pdf - PDF document fields from GROQ.
 * @returns A fetchable PDF URL, or `null` when neither field is set.
 */
export function resolvePdfUrl(pdf: Pick<SanityPdf, 'cdnUrl' | 'fileUrl'>): string | null {
  // Added/Modified by Rajarshi for TBD
  const url = pdf.cdnUrl?.trim() || pdf.fileUrl?.trim();
  return url || null;
}
