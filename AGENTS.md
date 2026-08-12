<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md

Agent operating rules for this **Next.js + TypeScript (+ optional Prisma) starter** repository.

Human contribution standards, workflow, and the documentation map live in **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Keep this file synchronized with CONTRIBUTING when standards change. For deeper topic rules, follow the linked documents under `docs/` rather than inventing conventions.

Primary project objectives (replace with product goals during conversion):

- Deliver a maintainable App Router application
- Keep presentation, domain logic, and persistence clearly separated
- Meet accessibility, performance, and SEO expectations where the surface is public
- Prefer documented conventions over ad-hoc patterns

---

# IMPORTANT

This project uses a modern version of Next.js whose APIs and conventions may differ from your training data.

**Before modifying framework-level code, always consult the relevant documentation inside:**

```text
node_modules/next/dist/docs/
```

Never assume older Next.js behaviour. If documentation contradicts prior knowledge, follow the documentation.

---

# Decision Priority

When making implementation decisions, optimize in this order:

1. Correctness
2. Existing project conventions
3. Maintainability
4. Readability
5. Performance
6. Developer convenience

When requirements are ambiguous:

- Preserve existing behaviour
- Avoid assumptions
- Request clarification whenever a decision could affect architecture or UX

---

# Documentation Map

| Document                                                       | Scope                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| [SETUP.md](./SETUP.md)                                         | Local development setup                                           |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                           | Contribution standards and workflow (human entry point)           |
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

Read the relevant document before implementing work in that area. Update those documents when behaviour or conventions change.

---

# Tech Stack

- TypeScript (strict mode)
- React
- Next.js (App Router)
- Tailwind CSS
- Prisma (when persistence is enabled)
- next-intl
- next-themes
- Third-party integrations as required (document in INTEGRATIONS)
- ESLint
- Prettier
- Jest (unit + integration; see [docs/TESTING.md](./docs/TESTING.md))
- Docker / Compose (see [docs/DOCKER.md](./docs/DOCKER.md))
- Infisical for secrets

---

# Repository Structure

```text
app/
components/
hooks/
lib/
modules/
prisma/
types/
utils/
tests/
public/
docs/
src/i18n/
messages/
```

| Directory     | Responsibility                                                                           |
| ------------- | ---------------------------------------------------------------------------------------- |
| `app/`        | Routes, layouts, pages; thin Server Actions and Route Handlers                           |
| `components/` | Reusable UI; primarily presentational                                                    |
| `hooks/`      | Reusable React hooks                                                                     |
| `modules/`    | Feature backend: `<feature>.controller.ts`, `.service.ts`, `.repository.ts` together     |
| `prisma/`     | Schema and migrations                                                                    |
| `lib/`        | Shared application logic (SEO helpers, API wrappers, logging, storage, Prisma singleton) |
| `utils/`      | Pure helper functions                                                                    |
| `types/`      | Shared TypeScript contracts                                                              |
| `tests/`      | Shared test helpers (for example Prisma mocks); suites may also be colocated             |
| `public/`     | Static assets                                                                            |
| `docs/`       | Project documentation                                                                    |
| `src/i18n/`   | next-intl routing and request configuration                                              |
| `messages/`   | Locale dictionaries                                                                      |

Backend features live under **`modules/<feature>/`** with colocated controller, service, and repository files—not separate top-level folders for each layer. Components focus on presentation. Full backend rules: [docs/BACKEND.md](./docs/BACKEND.md).

---

# Coding Standards

Always:

- Use TypeScript strict mode
- Prefer interfaces for object contracts
- Never use `any` unless there is no practical alternative
- Never disable TypeScript errors unless explicitly requested
- Prefer named exports
- Write small focused functions
- Prefer composition over inheritance
- Avoid deeply nested conditionals
- Remove dead code and unused imports
- Reuse existing utilities before introducing new ones
- Avoid duplicate implementations

Naming:

- Components: `PascalCase.tsx`
- Other code files: `camelCase.extension`
- Methods and variables: `camelCase` (except components and true constants)
- Names must clearly describe purpose

File organization (typical order): imports → constants → types → utilities → main implementation → helpers → exports.

Avoid:

- Magic numbers and magic strings
- Global mutable state
- Unnecessary abstractions
- Premature optimization
- Introducing global client state libraries unless explicitly required

---

# React and Frontend

Prefer:

- Server Components by default
- Client Components only when interactivity requires them
- Small client boundaries (do not mark an entire page or layout `"use client"` because one child needs interactivity)
- Suspense where appropriate
- Reusable hooks for shared behaviour
- Native HTML, CSS, Server Components, and browser APIs before JavaScript-only solutions

Avoid:

- Prop drilling; prefer composition, URL state, or React Context
- Large monolithic components
- Mixing business logic with rendering
- Direct Prisma or raw `fetch` from UI; use adapters → module controllers → services → repositories (read-only server loaders may call the feature service—see [docs/BACKEND.md](./docs/BACKEND.md))
- Custom `console` logging in production client bundles

Treat console errors, unhandled rejections, hydration mismatches, and failed resource requests as defects unless documented.

---

# Styling and Layout

Use Tailwind CSS only, with semantic theme tokens from [docs/THEMING.md](./docs/THEMING.md).

Do not:

- Use inline styles
- Introduce CSS files unless already part of the feature
- Use arbitrary values (`w-[41px]`, `mt-[73px]`) unless no design token exists
- Hardcode theme-specific colours in components

Every page must:

- Use the shared layout / spacing wrappers expected by the project
- Maintain consistent horizontal spacing and vertical rhythm
- Support responsive layouts down to **300px** viewport width

Navigation and footer must follow the global spacing system. Full theming, fonts, contrast, focus, and motion rules: [docs/THEMING.md](./docs/THEMING.md).

---

# Accessibility

All new UI must satisfy WCAG AA. At minimum: semantic HTML, keyboard accessibility, visible focus states, appropriate ARIA (only when needed), image `alt` text, and accessible forms.

Full rules and checklists: [docs/SEO.md](./docs/SEO.md). Focus, contrast, and reduced motion: [docs/THEMING.md](./docs/THEMING.md).

---

# Performance

Optimize for Core Web Vitals, minimal client JavaScript, image optimization (`next/image`), fonts via `next/font`, lazy loading of non-critical work, and minimal bundle size.

Prefer server-side data fetching; avoid request waterfalls and duplicate fetches. Choose caching deliberately ([docs/CACHING.md](./docs/CACHING.md)). Do not let third-party scripts block the critical path ([docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)).

Full performance and Core Web Vitals guidance: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

Lighthouse scores are a quality indicator (aim **90+** where practical), not a license to compromise functionality, accessibility, security, content quality, or maintainability. Audit production builds, not only `next dev`. Fix root causes rather than suppressing warnings. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

# SEO and Internationalization

Public pages must use the Metadata API (`metadata` / `generateMetadata`), meaningful titles and descriptions, canonical URLs, Open Graph / Twitter where appropriate, proper heading hierarchy, and structured semantic HTML.

Locale-prefixed routing via `next-intl`. Static user-facing copy belongs in `messages/*.json`. Do not hardcode UI copy.

- SEO / semantic HTML / accessibility: [docs/SEO.md](./docs/SEO.md)
- i18n: [docs/INTERNATIONALIZATION.md](./docs/INTERNATIONALIZATION.md)

---

# Error Handling

Always:

- Fail gracefully
- Surface meaningful errors
- Log useful debugging information without exposing internals to users
- Handle loading and empty states

Never silently ignore exceptions. Validate and sanitize input in module controllers and App Router adapters (Server Actions and Route Handlers). Wrap every route method with `withRouteHandler` and every controller entry point with `withControllerEta`; sanitize POST/PUT/PATCH bodies with `sanitizeInput`. Map Prisma failures in repositories/services—do not leak raw database errors to clients. See [docs/BACKEND.md](./docs/BACKEND.md).

---

# Dependencies and Integrations

Do not introduce new packages unless existing dependencies cannot solve the problem, the package has clear long-term benefit, and it is actively maintained.

Every new or changed third-party integration must be documented in [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md) before deployment. Evaluate performance, privacy, accessibility, and security impact first.

---

# Environment

Never commit `.env`, secrets, API keys, tokens, or credentials.

Secrets are managed through Infisical (dev, staging, prod scopes). Do not create Infisical secrets yourself; ask an authorized administrator. Always ask for the exact env var key instead of assuming. When a new variable is introduced, update [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) before deploying. Local `.env` holds `INFISICAL_TOKEN` only—never `DATABASE_URL`, `TEST_DATABASE_URL`, or other app secrets. Run Next.js, Prisma CLI, and Jest via `dotenv -- infisical run -- …` (or project scripts that use that wrapper).

---

# Documentation (TSDoc) and Traceability

Every exported entity must include a multi-line TSDoc comment covering purpose, `@param`, `@returns` where applicable, important behaviour, and side effects or constraints. Keep TSDoc synchronized with implementation. Do not restate the obvious.

Annotate code introduced or modified for the current task:

```ts
// Added/Modified by <Author> for <Issue No.>
```

```ts
// Added/Modified by <Author> for <Issue No.> — START
// ...modified code...
// Added/Modified by <Author> for <Issue No.> — END
```

Do not annotate unchanged code. If author name and/or issue number is unknown, ask instead of assuming.

Meaningful features, fixes, and architectural changes must update [docs/CHANGELOG.md](./docs/CHANGELOG.md).

---

# Git Hygiene

Never:

- Rename unrelated files
- Reformat unrelated code
- Modify unrelated features
- Bundle refactoring with feature work

Keep changes scoped to the requested task. Follow branch and commit conventions in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

# Client Constraints

Do not:

- Modify branding assets
- Change approved copy
- Change approved designs

Unless explicitly instructed. Implementation must faithfully follow the approved Figma design.

---

# Testing and Definition of Done

Before considering work complete:

- Project builds successfully; TypeScript and ESLint pass
- **Jest tests pass; every new or modified API route/controller has tests** (unit with Prisma mock and/or integration as appropriate)—see [docs/TESTING.md](./docs/TESTING.md)
- Affected API endpoints smoke-tested in **Postman** before commit
- No unused imports or dead code
- No production console errors, hydration mismatches, or mixed content on touched surfaces
- Relevant `docs/` updated
- Responsive behaviour verified (including ~300px)
- WCAG AA accessibility expectations met
- SEO and i18n requirements satisfied for public pages where applicable
- Client JavaScript, images, fonts, and third-party scripts justified and minimized where practical
- Caching/rendering choices for new routes intentional and recorded in [docs/CACHING.md](./docs/CACHING.md) when applicable

Pre-commit hook runs: unit tests (`npm test`), `tsc` (`npm run typecheck`), and `npm run build`.

Production audit flow:

```text
Development → Production build → Production server/deployment
  → Lighthouse audit → Fix root causes → Re-test
```

---

# Engineering Principles

Every contribution should:

- Prefer simplicity over cleverness
- Prefer readability over brevity
- Prefer maintainability over premature optimization
- Reuse existing abstractions before creating new ones
- Produce production-ready code
- Preserve backwards compatibility unless instructed otherwise
- Leave the codebase cleaner than it was found

Accessibility verification path:

```text
Developer
  → ESLint accessibility rules
  → axe-core automated tests
  → Lighthouse
  → WAVE visual inspection
  → Manual WCAG review
      (keyboard, focus, screen reader, zoom/reflow, forms, dynamic content, motion)
```

<!-- END:nextjs-agent-rules -->
