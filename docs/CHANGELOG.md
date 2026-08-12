# Changelog

Notable project changes are recorded here. This file is a high-level summary and does not replace Git history.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md).

When converting this starter into a real project, keep this structure and append new versions below. Do not carry template-internal iteration history into the product changelog.

---

## Version 1.2.0

**Release Date:** 2026-08-08

### Issue

**Developer:** Rajarshi

**Type:** Added

#### Summary

- Sanity `pdf` document schema with CDN URL helper input.
- Public PDF listing and DearFlip (dFlip) viewer routes under `/pdfs`.
- Installed `@dearhive/dearflip-jquery-flipbook` and sync script copying assets to `public/dflip`.

---

## Version 1.1.0

**Release Date:** 2026-08-07

### Issue

**Developer:** Rajarshi

**Type:** Added

#### Summary

- Sanity blog integration: shared client/queries, `blogService`, listing cards on the public home page, and slug detail pages with Portable Text rendering.
- Documented Sanity touchpoints in `docs/INTEGRATIONS.md` and initial blog caching notes in `docs/CACHING.md`.
- New packages Intalled -> 
    1. @portabletext/react
    2. @sanity/client
    3. @sanity/vision
    4. @sanity/image-url
    5. sanity

---

## Version 1.0.0

**Release Date:**

### Issue

**Developer:** —

**Type:** Added

#### Summary

- Initial Next.js App Router + TypeScript starter baseline (Tailwind, next-intl, next-themes, ESLint, Prettier, Husky).
- Infisical-backed secrets workflow; local `.env` holds `INFISICAL_TOKEN` only.
- Optional Prisma persistence conventions (`modules/<feature>/` controller → service → repository) and Prisma Client generator output at `generated/prisma`.
- API route/controller standards: centralized `withRouteHandler`, `sanitizeInput` for mutating bodies, `withControllerEta` for execution-time / slow-API logging.
- Jest testing framework (`docs/TESTING.md`): unit tests with Prisma mocks, Infisical-backed integration DB URL, Postman before commit; pre-commit runs test + typecheck + build.
- Docker multi-stage image (`output: 'standalone'`) and Compose (`docs/DOCKER.md`); secrets injected via Infisical at run/build time, not baked into images.
- Object storage abstraction (`lib/storage`) defaulting to Cloudflare R2 with Amazon S3 switch via Infisical (`STORAGE_PROVIDER`); documented in `docs/INTEGRATIONS.md`.
- Project documentation map under `docs/` plus one-time [TEMPLATE_CONVERSION.md](../TEMPLATE_CONVERSION.md).

---

## Change Types

Use one of:

- Added
- Changed
- Fixed
- Removed
- Deprecated
- Refactored
- Performance
- Security
- Documentation
