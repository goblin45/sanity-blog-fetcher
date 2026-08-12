import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react';
import Image from 'next/image';

import { urlForImage } from '@/lib/sanity/client';
import type { SanityImageBlock } from '@/types/blog';

interface PortableTextBodyProps {
  /** Portable Text blocks from a Sanity `post.body` field. */
  value: PortableTextBlock[];
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-foreground mt-10 mb-4 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-foreground mt-8 mb-3 text-xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-foreground mt-6 mb-2 text-lg font-semibold">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-muted-foreground mb-4 leading-7">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-border text-muted-foreground my-6 border-l-4 pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground mb-4 list-disc space-y-2 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground mb-4 list-decimal space-y-2 pl-6">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const isExternal = href.startsWith('http');

      return (
        <a
          href={href}
          className="text-foreground underline underline-offset-4"
          {...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImageBlock }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      const src = urlForImage(value).width(1200).height(675).fit('max').url();
      const alt = value.alt?.trim() || 'Blog post image';

      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </figure>
      );
    },
  },
};

/**
 * Renders a Sanity Portable Text body with project typography tokens.
 *
 * @param props - Component props containing the Portable Text value.
 * @returns Styled rich-text content for a blog post.
 */
export function PortableTextBody({ value }: PortableTextBodyProps) {
  // Added/Modified by Rajarshi for TBD
  return <PortableText value={value} components={portableTextComponents} />;
}
