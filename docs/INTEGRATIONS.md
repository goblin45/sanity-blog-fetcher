# Third-Party Integrations

Single source of truth for third-party integrations in this project.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Isolation expectations: [ARCHITECTURE.md](./ARCHITECTURE.md). Environment variables: [ENVIRONMENT.md](./ENVIRONMENT.md).

When introducing an integration, append a new section under **Current Integrations**. When modifying one, update its existing section. Do not create separate per-integration documents unless explicitly instructed.

> Google Tag Manager and Google Analytics should use `@next/third-parties/google` when implemented.

---

## Evaluation Before Integration

Third-party services (analytics, Microsoft Clarity, advertising, CRM, chat widgets, social embeds, heatmaps, marketing tools) affect performance, privacy, accessibility, security, and layout stability.

Before adding a script or embed:

1. Confirm it is required for a real product need.
2. Determine whether it can load after the initial page experience.
3. Load it with an appropriate Next.js strategy; do not block the critical rendering path.
4. Measure impact on JavaScript cost, LCP/INP, and layout shift.
5. Document the integration in this file before deployment.

Avoid embeds that provide little value. Prefer deferred or conditional loading for non-critical tools. Request browser permissions only when a feature genuinely needs them.

Each integration section should cover purpose, responsibilities, application touchpoints, implementation or data flow, dependencies, failure handling, and maintenance notes—including any known performance or privacy constraints.

---

## Current Integrations

## Object storage (Cloudflare R2 / Amazon S3)

### Purpose

Server-side upload and fetch pathway for user or CMS assets (images, documents, etc.) via an S3-compatible bucket. Default provider is **Cloudflare R2**; **Amazon S3** is supported by changing Infisical env only.

### Responsibilities

- Upload objects (server-side PUT)
- Build public CDN URLs for display/fetch
- Issue presigned upload and download URLs
- Delete objects
- Keep provider SDKs behind `ObjectStorage` so feature code does not couple to R2 or AWS

### Application Touchpoints

| Path                             | Role                                                     |
| -------------------------------- | -------------------------------------------------------- |
| `types/storage.ts`               | Provider-agnostic contracts                              |
| `lib/storage/`                   | Config, S3-compatible adapter, factory, `storageService` |
| Feature modules / route handlers | Call `storageService` only (never `@aws-sdk/*` from UI)  |

### Implementation Overview

R2 and S3 both speak the S3 API. One adapter (`S3CompatibleObjectStorage`) uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`. Provider differences are limited to endpoint, region, and path-style flags resolved in `loadObjectStorageConfig()`.

```ts
import { storageService } from '@/lib/storage';

// Server upload
const result = await storageService.upload({
  key: `uploads/${crypto.randomUUID()}.png`,
  body: buffer,
  contentType: 'image/png',
});
// result.publicUrl → STORAGE_PUBLIC_BASE_URL + key

// Client direct upload
const uploadUrl = await storageService.createPresignedUploadUrl({
  key: `uploads/${id}.png`,
  contentType: 'image/png',
});

// Private download
const downloadUrl = await storageService.createPresignedDownloadUrl({ key });
```

### Switching R2 → Amazon S3

In Infisical (no code change required for the happy path):

1. Set `STORAGE_PROVIDER=s3`
2. Set `STORAGE_REGION` to the bucket region (for example `us-east-1`)
3. Set `STORAGE_ACCESS_KEY_ID` / `STORAGE_SECRET_ACCESS_KEY` to IAM keys
4. Set `STORAGE_BUCKET` and `STORAGE_PUBLIC_BASE_URL` (CloudFront or S3 website/CDN domain)
5. Unset `STORAGE_ACCOUNT_ID` (R2-only) unless you keep a custom `STORAGE_ENDPOINT`
6. Set `STORAGE_FORCE_PATH_STYLE=false` unless using a path-style endpoint

Optional: `STORAGE_ENDPOINT` for S3-compatible gateways or custom endpoints.

### Data Flow

```text
Route / Server Action / feature service
  → storageService (ETA-wrapped mutating ops)
    → ObjectStorage (interface)
      → S3CompatibleObjectStorage
        → S3Client (R2 endpoint or AWS regional endpoint)
  ← public URL (CDN) or presigned URL
```

### Dependencies

- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`

Secrets and bucket settings: Infisical only — see [ENVIRONMENT.md](./ENVIRONMENT.md).

### Failure Handling

- Missing Infisical vars throw at config load with a clear key name
- SDK/network errors propagate to the caller; wrap routes with `withRouteHandler` and log via `logger`
- Do not expose access keys or raw provider errors to clients

### Maintenance Notes

- Prefer public assets via `STORAGE_PUBLIC_BASE_URL` (R2 custom domain or CDN) for cacheable GETs
- Use presigned URLs for private objects or direct browser uploads
- Keep this section updated when adding a second bucket or a non-S3 provider (would need a new `ObjectStorage` implementation)

### Template section (copy and fill for new integrations)

```markdown
## <Integration Name>

### Purpose

…

### Responsibilities

…

### Application Touchpoints

…

### Implementation Overview

…

### Data Flow

…

### Dependencies

…

### Failure Handling

…

### Maintenance Notes

…
```

## Sanity CMS (blog content)

### Purpose

Headless CMS for public blog posts (`post` documents). The Next.js app reads posts via GROQ and renders listing cards plus slug detail pages.

### Responsibilities

- Server-side GROQ fetches for blog listing and detail
- Portable Text body rendering
- Sanity image CDN URLs for inline post images

### Application Touchpoints

| Path | Role |
| ---- | ---- |
| `lib/sanity/client.ts` | Shared `@sanity/client` + image URL builder |
| `lib/sanity/queries.ts` | GROQ queries for posts |
| `modules/blog/blog.service.ts` | Read-only blog service used by public pages |
| `app/[locale]/(public)/page.tsx` | Blog listing |
| `app/[locale]/(public)/[slug]/page.tsx` | Blog detail by slug |
| `components/blog/` | Card and Portable Text UI |

### Implementation Overview

Public pages call `blogService` (no HTTP adapter). The client uses API reads (`useCdn: false`) against project `12jszf8z` / dataset `production`, with Next ISR (`revalidate: 5`) on both the route segment and `client.fetch` options—see [CACHING.md](./CACHING.md).

### Data Flow

```text
Public page (Server Component)
  → blogService
    → sanityClient.fetch(GROQ)
  ← BlogPost / BlogPostSummary
  → BlogCard / PortableTextBody
```

### Dependencies

- `@sanity/client`
- `@sanity/image-url`
- `@portabletext/react`

### Failure Handling

- Fetch failures are logged via `logger` and rethrown so the route error boundary can surface them
- Unknown slugs call `notFound()`

### Maintenance Notes

- Prefer Live Content API / `next-sanity` if Visual Editing or real-time preview is required later
- Keep `next.config.ts` `images.remotePatterns` aligned with `cdn.sanity.io`
- Document caching/revalidation choices in [CACHING.md](./CACHING.md) when ISR or webhooks are added

## DearFlip (dFlip) PDF flipbook

### Purpose

Render Sanity `pdf` documents as interactive 3D flipbooks on the public site.

### Responsibilities

- Serve DearFlip static assets from `/dflip`
- Client-side flipbook initialization for a PDF URL
- List and open Sanity `pdf` documents

### Application Touchpoints

| Path | Role |
| ---- | ---- |
| `lib/sanity/schemaTypes/pdf.ts` | Studio schema |
| `lib/sanity/components/CdnUrlInput.tsx` | Read-only CDN URL field |
| `modules/pdf/pdf.service.ts` | GROQ reads for PDF documents |
| `components/pdf/DearFlipViewer.tsx` | Client DearFlip wrapper |
| `app/[locale]/(public)/pdfs/` | Listing + viewer routes |
| `scripts/sync-dflip.mjs` | Copies package assets into `public/dflip` |

### Implementation Overview

Install the lite package:

```bash
npm install @dearhive/dearflip-jquery-flipbook
npm run sync:dflip
```

Commercial license builds from DearFlip should replace the contents of `public/dflip` (or the npm package) — do not rely on the CC BY-NC-ND lite build for commercial production.

### Dependencies

- `@dearhive/dearflip-jquery-flipbook` (includes jQuery under `dflip/js/libs`)
- `@sanity/icons` (Studio PDF icon)

### Failure Handling

- Missing PDF URL shows an empty-state message
- DearFlip init failures are logged in the browser console

### Maintenance Notes

- Re-run `npm run sync:dflip` after upgrading the DearFlip package
- Lite package is non-commercial; purchase a commercial license for production client work
