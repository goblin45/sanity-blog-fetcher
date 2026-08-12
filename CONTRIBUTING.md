# Contribution Guidelines

This document is the entry point for contributors to this starter repository. It covers development standards, workflow, and where to find deeper technical documentation.

For local installation and environment setup, see [SETUP.md](./SETUP.md).

---

## Documentation Map

| Document                                                       | Scope                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| [SETUP.md](./SETUP.md)                                         | Local development setup                                           |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)                 | Architecture, rendering, performance, and Core Web Vitals         |
| [docs/BACKEND.md](./docs/BACKEND.md)                           | Prisma and `modules/<feature>/` (controller, service, repository) |
| [docs/CACHING.md](./docs/CACHING.md)                           | Caching and revalidation strategy                                 |
| [docs/THEMING.md](./docs/THEMING.md)                           | Theme provider, tokens, fonts, contrast, focus, and motion        |
| [docs/INTERNATIONALIZATION.md](./docs/INTERNATIONALIZATION.md) | Locale routing, dictionaries, and localization rules              |
| [docs/SEO.md](./docs/SEO.md)                                   | Semantic HTML, accessibility, metadata, and SEO                   |
| [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md)                   | Environment variable registry                                     |
| [docs/DOCKER.md](./docs/DOCKER.md)                             | Dockerfile, Compose, Infisical-injected container secrets         |
| [docs/TESTING.md](./docs/TESTING.md)                           | Jest unit/integration tests, Prisma mocks, Postman, Infisical     |
| [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)                 | Third-party integration registry and loading rules                |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md)                       | Version history of meaningful changes                             |

Read the relevant document before implementing work in that area. Keep those documents updated when behaviour or conventions change.

---

## Quality Indicator

Lighthouse scores (Performance, Accessibility, Best Practices, SEO) are a quality indicator, not the sole definition of application quality. Aim for **90+** in each category where practical. Do not chase a perfect score by compromising functionality, accessibility, content quality, security, maintainability, or user experience.

Prefer fixing the root cause of warnings over suppressing them. Audit production builds, not only `next dev`. Sound engineering should produce strong Lighthouse results as a consequence—not as a last-minute patch pass.

Detailed practices live in:

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — performance and Core Web Vitals
- [docs/SEO.md](./docs/SEO.md) — accessibility and SEO
- [docs/THEMING.md](./docs/THEMING.md) — fonts, focus, contrast, motion, hydration-safe theming
- [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md) — third-party scripts and embeds
- [docs/CACHING.md](./docs/CACHING.md) — caching and revalidation

---

## Naming Conventions

- Component files: `PascalCase.tsx`
- Other code files: `camelCase.extension`
- Methods and variables: `camelCase`, except components and true constants
- Names must clearly describe purpose

---

## TypeScript

- All application code must be TypeScript (`.ts` / `.tsx`). Avoid `.js` / `.jsx` except where the framework requires it.
- Prefer interfaces for object contracts. Never use `any` unless there is no practical alternative.
- Define shared domain interfaces under `@/types` (or `@/types/models` when modelling entities).
- Request and response contracts for APIs belong under `@/types`.
- Interfaces and types should be intentional and non-redundant.

---

## File Organization

Arrange each file in a stable order:

1. Imports
2. Constants
3. Types and interfaces
4. Utility functions
5. Main implementation (components, services, etc.)
6. Helper functions
7. Exports

Keep related logic together. Prefer App Router route groups where they clarify structure. Use Incremental Static Regeneration (ISR) for dynamic content pages such as individual blog posts. Caching conventions are tracked in [docs/CACHING.md](./docs/CACHING.md).

For persistence features, place work under `modules/<feature>/` with colocated `<feature>.controller.ts`, `<feature>.service.ts`, and `<feature>.repository.ts`. Do not use separate top-level controller/service/repository folders. See [docs/BACKEND.md](./docs/BACKEND.md).

Project structure and architectural boundaries are defined in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## Documentation Standards (TSDoc)

Use TSDoc for exported entities instead of informal comments. Documentation must be formal, concise, and kept in sync with the implementation. Do not restate what the code already makes obvious.

Every exported entity (functions, classes, interfaces, types, components, hooks, utilities, services, enums) must include a multi-line TSDoc comment covering:

- Purpose and responsibility
- `@param` for every parameter
- `@returns` where applicable
- Important business logic or implementation details when helpful
- Side effects, assumptions, limitations, or usage constraints

---

## Change Traceability

Annotate code introduced or modified for the current task.

Single-line change:

```ts
// Added/Modified by <Author> for <Issue No.>
```

Block of changes:

```ts
// Added/Modified by <Author> for <Issue No.> — START

// ...modified code...

// Added/Modified by <Author> for <Issue No.> — END
```

Do not annotate unchanged code. Every annotation must reference the correct author and issue number.

---

## Environment Variables

- Do not create new Infisical secrets yourself. Ask an authorized administrator to create the variable and grant your token access.
- If you lack access to an existing variable, request the appropriate Infisical scope.
- Never store, share, or commit secret values. Secrets are managed exclusively through Infisical.
- When a new variable is introduced, update [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) before deploying. Document at least the variable name and purpose.

Setup details for the local `INFISICAL_TOKEN` are in [SETUP.md](./SETUP.md).

---

## Frontend Standards

- Prefer Server Components. Use Client Components only when interactivity requires them. Keep the client boundary as small as possible—do not mark an entire page or layout as a Client Component because one child needs interactivity.
- Create functional components that are small, focused, and primarily presentational.
- Separate logic from UI for larger features. Keep business logic in `modules/<feature>/` (service layer, with repository for persistence and controller for orchestration)—not in JSX.
- Limit prop drilling. Prefer composition, URL state, or React Context over introducing global state libraries.
- Place page-specific components under `@/components/<feature>/`.
- Use shared layout wrappers for consistent spacing and alignment. See layout expectations in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
- Keep content pages server-rendered where practical. Interactive pieces belong in dedicated client components under `@/components`.
- API and data access from pages and components must not use Prisma or repositories directly. Mutating and HTTP-shaped flows go adapters → module controllers → services → repositories. Read-only Server Component / loader fetches may call the feature **service** when no HTTP response shaping is needed—still never Prisma from UI. See [docs/BACKEND.md](./docs/BACKEND.md).
- Wrap external calls in `try/catch` and fail gracefully with meaningful feedback.
- Store static assets under `public/assets/`. Prefer CDN URLs and modern formats (WebP/AVIF) where appropriate.
- Prefer native HTML, CSS, Server Components, and browser APIs before introducing JavaScript-only solutions or new dependencies.
- Do not leave custom `console` logging in production client bundles. Treat console errors, unhandled rejections, hydration mismatches, and failed resource requests as defects unless documented.

Styling, theming, internationalization, SEO, and accessibility each have dedicated specifications:

- [docs/THEMING.md](./docs/THEMING.md)
- [docs/INTERNATIONALIZATION.md](./docs/INTERNATIONALIZATION.md)
- [docs/SEO.md](./docs/SEO.md)

---

## Backend, Prisma, and API adapters

When the project uses a database, follow [docs/BACKEND.md](./docs/BACKEND.md). Each feature lives under `modules/<feature>/`:

- **Repository** (`<feature>.repository.ts`): Prisma only; map persistence models to domain/DTO types.
- **Service** (`<feature>.service.ts`): business rules and use-cases; call repositories; no PrismaClient imports when a repository exists for that concern.
- **Controller** (`<feature>.controller.ts`): orchestrate validation and response shaping; call services; never import Prisma.
- **Adapter** (`app/api/**/route.ts`, Server Actions): thin Next.js edge; call the feature controller.

Do not create separate top-level `controllers/`, `services/`, or `repositories/` directories.

Also:

- Document the route or action purpose near the implementation.
- Wrap every route method with `withRouteHandler`; wrap every controller entry point with `withControllerEta`; sanitize POST/PUT/PATCH bodies with `sanitizeInput` (see [docs/BACKEND.md](./docs/BACKEND.md)).
- Validate and sanitize incoming data; handle errors without exposing internals; log via `lib/logging/logger.ts`.
- Use migrations for shared environments; run Prisma CLI via Infisical (`dotenv -- infisical run -- …` or project `db:*` scripts)—never put `DATABASE_URL` in the local `.env`.
- Prefer existing patterns in `modules/` and `lib/` before inventing new ones.
- **Every new or modified API route/controller must include Jest tests** (see [docs/TESTING.md](./docs/TESTING.md)). Unit tests mock Prisma; integration tests load `TEST_DATABASE_URL` / `DATABASE_URL` from Infisical.
- Manually verify affected endpoints in **Postman** before committing API changes.

---

## Testing

Full policy: [docs/TESTING.md](./docs/TESTING.md).

- Framework: **Jest** (config via `next/jest` from the `next` package—not a separate dependency); scripts wrapped with Infisical.
- Unit: `npm test` — mock Prisma via `tests/helpers/prismaMock.ts`.
- Integration: `npm run test:integration` — database URL from Infisical.
- Pre-commit runs `npm test`, `npm run typecheck`, and `npm run build`.

---

## Integrations

Every new third-party integration must be documented in [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md) before deployment. Update the existing section when an integration is modified, extended, or deprecated.

Document from an implementation perspective, including purpose, responsibilities, application touchpoints, data flow, and maintenance considerations. Evaluate performance, privacy, accessibility, and security impact before shipping.

---

## Best Practices

- Serve production traffic over HTTPS. Avoid mixed content (HTTPS pages loading HTTP assets or APIs).
- Use `rel="noopener noreferrer"` when opening external links in a new tab; use new-tab behaviour only when it improves UX.
- Do not request browser permissions (location, camera, microphone, notifications) unless a real feature needs them.
- Do not introduce deprecated browser APIs or obsolete practices. Keep dependencies justified and maintained.
- Prevent hydration mismatches: be careful with theme detection, `window` / `document`, random values, and timestamps. Follow [docs/THEMING.md](./docs/THEMING.md) for theme hydration patterns.

---

## Optimization

- Prefer CDN-hosted assets and appropriately sized images via `next/image`.
- Use `next/font` for application fonts. See [docs/THEMING.md](./docs/THEMING.md).
- Reserve space for images and dynamic UI to protect Cumulative Layout Shift.
- Prioritize above-the-fold content; lazy-load below-the-fold media and non-critical widgets.
- Avoid unnecessary dependencies; remove unused packages.
- Prefer server-side data fetching; avoid client waterfalls and duplicate requests. See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
- Choose rendering and caching deliberately. See [docs/CACHING.md](./docs/CACHING.md).
- Prefer ISR for dynamic public content with a moderate revalidation interval.
- Do not let third-party scripts block the critical rendering path. See [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md).

---

## ESLint and Quality Gates

- Avoid `any`. If unavoidable in a file, declare `/* eslint-disable @typescript-eslint/no-explicit-any */` at the top of that file only.
- Do not leave unused variables or methods. Comment with documentation only when retention is intentional and temporary.
- Do not disable `@typescript-eslint/no-unused-vars` unless absolutely necessary.
- `tsc`, lint, unit tests (`npm test`), and the production build must pass before committing. Pre-commit enforces test + typecheck + build.

---

## Version Control

### Branches

Create branches from the branch you intend to merge into (for example `development`):

- `feature/<feature-name>`
- `fix/<bug-name>`
- `refactor/<module-name>`

### Commits

```text
#issue_no: short, meaningful message
```

Example: `#12: Add tag model and controller`

### Pull Requests

- Summarize every meaningful change after reviewing the full commit range.
- Include screenshots for UI changes when helpful.
- Do not merge to `production` or `development` unless explicitly instructed by a reviewer or repository owner.

### Changelog

Record meaningful features, fixes, and architectural changes in [docs/CHANGELOG.md](./docs/CHANGELOG.md).

---

## Production Audits

Measure performance and Lighthouse categories against a production build or deployment, not exclusively against `next dev`.

```text
Development → Production build → Production server/deployment
  → Lighthouse audit → Fix root causes → Re-test
```

Compare audits under consistent conditions. Category checklists live in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) (performance), [docs/SEO.md](./docs/SEO.md) (accessibility and SEO), and [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md) (third-party impact).

---

## Definition of Done

A change is complete when:

- Requirements are satisfied and existing behaviour is preserved unless intentionally changed
- Code follows repository conventions; TypeScript, ESLint, Jest unit tests, and production build pass
- New or changed API routes/controllers include Jest tests; Postman smoke completed for those surfaces
- Relevant documentation under `docs/` is updated
- Responsive behaviour and WCAG AA accessibility expectations are met
- SEO and i18n requirements are satisfied for public pages where applicable
- Client JavaScript, images, fonts, and third-party scripts are justified and minimized where practical
- Production-relevant surfaces do not introduce console errors, hydration mismatches, or mixed content
- Caching and rendering choices for new routes are intentional and recorded in [docs/CACHING.md](./docs/CACHING.md) when applicable
