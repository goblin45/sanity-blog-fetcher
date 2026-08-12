'use client';

import { useEffect, useRef } from 'react';

interface DearFlipViewerProps {
  /** Absolute or site-relative URL of the PDF to open. */
  pdfUrl: string;
  /** Accessible title for the flipbook region. */
  title: string;
}

interface FlipBookInstance {
  dispose?: () => void;
}

interface JQueryFlipBook {
  (element: HTMLElement): {
    flipBook: (source: string, options: Record<string, unknown>) => FlipBookInstance;
  };
}

declare global {
  interface Window {
    jQuery?: JQueryFlipBook;
    dFlipLocation?: string;
  }
}

/**
 * Loads a stylesheet once per document.
 *
 * @param href - Stylesheet URL.
 */
function loadStyle(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Loads a script once per document and resolves when it is ready.
 *
 * @param src - Script URL.
 * @returns A promise that settles when the script loads or rejects on error.
 */
function loadScript(src: string): Promise<void> {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * Client-only DearFlip (dFlip) PDF flipbook viewer.
 *
 * Assets are served from `/dflip` (copied from
 * `@dearhive/dearflip-jquery-flipbook`). jQuery is loaded from that bundle —
 * do not import the npm `jquery` package into this component.
 *
 * @param props - Viewer props including PDF URL and title.
 * @returns A container that DearFlip mounts into.
 */
export function DearFlipViewer({ pdfUrl, title }: DearFlipViewerProps) {
  // Added/Modified by Rajarshi for TBD — START
  const containerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<FlipBookInstance | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pdfUrl) {
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        window.dFlipLocation = '/dflip/';
        loadStyle('/dflip/css/dflip.min.css');
        loadStyle('/dflip/css/themify-icons.min.css');

        await loadScript('/dflip/js/libs/jquery.min.js');
        await loadScript('/dflip/js/dflip.min.js');

        if (cancelled || !containerRef.current || !window.jQuery) {
          return;
        }

        if (containerRef.current.dataset.dflipInitialized === 'true') {
          return;
        }

        const options = {
          webgl: true,
          autoEnableOutline: false,
          autoEnableThumbnail: false,
          soundEnable: false,
          backgroundColor: 'transparent',
          hard: 'none',
          maxTextureSize: 1600,
          pageMode: window.innerWidth <= 768 ? 1 : 2,
          singlePageMode: window.innerWidth <= 768 ? 1 : 0,
          responsive: true,
          duration: 800,
          height: 640,
        };

        containerRef.current.dataset.dflipInitialized = 'true';
        flipbookRef.current = window.jQuery(containerRef.current).flipBook(
          pdfUrl,
          options,
        );
      } catch (error) {
        console.error('[dearflip] failed to initialize', error);
      }
    };

    void init();

    return () => {
      cancelled = true;
      flipbookRef.current?.dispose?.();
      flipbookRef.current = null;
      if (container) {
        container.dataset.dflipInitialized = 'false';
        container.replaceChildren();
      }
    };
  }, [pdfUrl]);

  return (
    <div
      ref={containerRef}
      className="_df_book min-h-[640px] w-full"
      role="region"
      aria-label={title}
    />
  );
  // Added/Modified by Rajarshi for TBD — END
}
