'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useState } from 'react';
import { useTranslations } from 'next-intl';

import { urlForImage } from '@/lib/sanity/client';
import type { BlogCarouselImage } from '@/types/blog';

interface BlogImageCarouselProps {
  /** Images from the Sanity `carouselImages` field. */
  images: BlogCarouselImage[];
}

/**
 * Accessible image carousel for blog post pages. Renders outside Portable Text
 * from the dedicated `carouselImages` document field.
 *
 * @param props - Carousel props including Sanity image entries.
 * @returns A keyboard-friendly carousel, or `null` when no valid images exist.
 */
export function BlogImageCarousel({ images }: BlogImageCarouselProps) {
  // Added/Modified by Rajarshi for TBD — START
  const t = useTranslations('BlogPost.carousel');
  const labelId = useId();
  const slides = images.filter((image) => Boolean(image.asset?._ref));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) {
        return;
      }

      const nextIndex = (index + slides.length) % slides.length;
      setActiveIndex(nextIndex);
    },
    [slides.length],
  );

  if (slides.length === 0) {
    return null;
  }

  const active = slides[activeIndex];
  const src = urlForImage(active).width(1200).height(675).fit('crop').url();
  const alt = active.alt?.trim() || t('fallbackAlt', { index: activeIndex + 1 });

  return (
    <section
      className="border-border bg-background mb-8 border"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
    >
      <h2
        id={labelId}
        className="sr-only"
      >
        {t('label')}
      </h2>

      <div className="bg-muted w-full overflow-hidden">
        <Image
          key={active._key}
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority={activeIndex === 0}
        />
      </div>

      {slides.length > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="border-border bg-secondary text-secondary-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-10 items-center justify-center border px-4 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => goTo(activeIndex - 1)}
              aria-label={t('previous')}
            >
              {t('previous')}
            </button>
            <button
              type="button"
              className="border-border bg-secondary text-secondary-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-10 items-center justify-center border px-4 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => goTo(activeIndex + 1)}
              aria-label={t('next')}
            >
              {t('next')}
            </button>
          </div>

          <p
            className="text-muted-foreground text-sm"
            aria-live="polite"
          >
            {t('status', {
              current: activeIndex + 1,
              total: slides.length,
            })}
          </p>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label={t('dotsLabel')}
          >
            {slides.map((slide, index) => (
              <button
                key={slide._key}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={t('goTo', { index: index + 1 })}
                className={`focus-visible:ring-ring h-2.5 w-2.5 rounded-full focus-visible:ring-2 focus-visible:outline-none ${
                  index === activeIndex
                    ? 'bg-foreground'
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'
                }`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
  // Added/Modified by Rajarshi for TBD — END
}
