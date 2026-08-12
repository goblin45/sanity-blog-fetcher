# Caching Strategy

Caching determines how pages and data are reused across requests. The wrong strategy either serves stale content or forces unnecessary work on every visit. The right strategy keeps responses fast while matching how often each surface actually changes.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Rendering context: [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Status

Sanity-backed blog routes use time-based ISR via a shared constant.

### Current decisions

| Surface | Rendering / data | Notes |
| ------- | ---------------- | ----- |
| `lib/sanity/revalidate.ts` | `SANITY_REVALIDATE_SECONDS = 5` | Single source of truth for blog ISR |
| `app/[locale]/(public)/page.tsx` | `export const revalidate = 5` | Listing |
| `app/[locale]/(public)/[slug]/page.tsx` | `export const revalidate = 5` | Detail |
| `modules/blog/blog.service.ts` | `sanityClient.fetch(..., { next: { revalidate: 5 } })` | Aligns the Sanity HTTP fetch with Next's data cache |
| `lib/sanity/client.ts` | `useCdn: false` | Reads the Sanity API (not CDN) so revalidation gets fresh publishes |

### How `revalidate = 5` behaves

1. After a successful render, Next may serve the **cached** page for up to 5 seconds.
2. After that window, the **next** request can trigger a background revalidation (stale-while-revalidate). The first response after expiry may still be the previous HTML; a following request usually shows the update.
3. A hard reload **inside** the 5-second window will **not** pull new Sanity content.
4. This is independent of Studio “publish”: if the document is only saved as a draft, the public API will not return it.

### Planned coverage

- On-demand invalidation (Sanity webhooks / cache tags)
- Live Content API / Visual Editing
- CDN vs API trade-offs if `useCdn` is re-enabled for production scale
