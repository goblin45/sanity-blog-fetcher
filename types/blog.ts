import type { PortableTextBlock } from '@portabletext/types';

/**
 * Sanity image asset reference embedded in Portable Text or document fields.
 */
export interface SanityImageAssetRef {
  _ref: string;
  _type: 'reference';
}

/**
 * Portable Text image block returned from Sanity `post.body`.
 */
export interface SanityImageBlock {
  _type: 'image';
  _key?: string;
  asset?: SanityImageAssetRef;
  alt?: string;
}

/**
 * Image entry from the post-level `carouselImages` array field.
 */
export interface BlogCarouselImage {
  _key: string;
  _type: 'image';
  alt?: string | null;
  asset?: SanityImageAssetRef;
}

/**
 * Blog post summary used on listing cards (no body payload).
 */
export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
}

/**
 * Full blog post including Portable Text body and optional carousel images.
 */
export interface BlogPost extends BlogPostSummary {
  body: PortableTextBlock[] | null;
  carouselImages: BlogCarouselImage[] | null;
}
