import { logger } from '@/lib/logging/logger';
import { sanityClient } from '@/lib/sanity/client';
import {
  BLOG_BY_SLUG_QUERY,
  BLOG_SLUGS_QUERY,
  BLOGS_QUERY,
} from '@/lib/sanity/queries';
import { SANITY_REVALIDATE_SECONDS } from '@/lib/sanity/revalidate';
import type { BlogPost, BlogPostSummary } from '@/types/blog';

/** Maximum characters shown as a card excerpt. */
const EXCERPT_MAX_LENGTH = 160;

/**
 * Next.js fetch cache options passed through `@sanity/client` so segment
 * `revalidate` and the Sanity request share the same ISR window.
 */
const sanityFetchOptions = {
  next: { revalidate: SANITY_REVALIDATE_SECONDS },
} as const;

/**
 * Trims Portable Text plain text into a short card excerpt.
 *
 * @param excerpt - Full plain-text body from `pt::text(body)`, or null.
 * @returns A truncated excerpt with an ellipsis when shortened, or `null` when empty.
 */
function truncateExcerpt(excerpt: string | null): string | null {
  if (!excerpt?.trim()) {
    return null;
  }

  const normalized = excerpt.replace(/\s+/g, ' ').trim();

  if (normalized.length <= EXCERPT_MAX_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}…`;
}

/**
 * Read-only blog service that loads Sanity `post` documents for public pages.
 * Pages and UI call this service directly; no HTTP adapter is required for
 * server-rendered listing and detail routes.
 */
// Added/Modified by Rajarshi for TBD — START
export const blogService = {
  /**
   * Fetches every published Sanity blog post for the listing page.
   *
   * @returns Blog post summaries ordered by newest first.
   */
  async getBlogs(): Promise<BlogPostSummary[]> {
    try {
      const blogs = await sanityClient.fetch<BlogPostSummary[]>(
        BLOGS_QUERY,
        {},
        sanityFetchOptions,
      );

      // Debug: inspect listing payloads in the Next.js terminal.
      console.log('[sanity] getBlogs', JSON.stringify(blogs, null, 2));

      return blogs.map((blog) => ({
        ...blog,
        excerpt: truncateExcerpt(blog.excerpt),
      }));
    } catch (error) {
      logger.error('Failed to fetch Sanity blogs', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },

  /**
   * Fetches a single blog post by its slug.
   *
   * @param slug - `slug.current` value from the Sanity post document.
   * @returns The matching post, or `null` when no document matches.
   */
  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const blog = await sanityClient.fetch<BlogPost | null>(
        BLOG_BY_SLUG_QUERY,
        { slug },
        sanityFetchOptions,
      );

      // Debug: inspect detail payloads (including Portable Text marks) in the terminal.
      console.log(
        '[sanity] getBlogBySlug',
        slug,
        JSON.stringify(blog, null, 2),
      );

      if (!blog) {
        return null;
      }

      return {
        ...blog,
        excerpt: truncateExcerpt(blog.excerpt),
        carouselImages: blog.carouselImages ?? [],
      };
    } catch (error) {
      logger.error('Failed to fetch Sanity blog by slug', {
        slug,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },

  /**
   * Returns slug params for static generation of blog detail routes.
   *
   * @returns An array of `{ slug }` objects for `generateStaticParams`.
   */
  async getBlogSlugs(): Promise<{ slug: string }[]> {
    try {
      return await sanityClient
        .withConfig({ useCdn: false })
        .fetch<{ slug: string }[]>(BLOG_SLUGS_QUERY);
    } catch (error) {
      logger.error('Failed to fetch Sanity blog slugs', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
};
// Added/Modified by Rajarshi for TBD — END
