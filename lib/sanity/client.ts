import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

/**
 * Shared Sanity client for server-side GROQ fetches against the production
 * dataset.
 *
 * `useCdn: false` hits the Sanity API directly so edits appear as soon as
 * Next.js revalidates (the CDN can lag briefly behind publishes).
 */
// Added/Modified by Rajarshi for TBD — START
export const sanityClient = createClient({
  projectId: '12jszf8z',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-08-07',
});

const imageBuilder = createImageUrlBuilder(sanityClient);

/**
 * Builds a CDN URL for a Sanity image source.
 *
 * @param source - Sanity image asset reference or image field value.
 * @returns An image URL builder scoped to this project's CDN.
 */
export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}
// Added/Modified by Rajarshi for TBD — END
