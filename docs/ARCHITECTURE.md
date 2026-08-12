# Architecture

High-level architecture for this Next.js starter: how the application is structured, why key decisions were made, and how to extend it safely.

Contribution workflow and the documentation map start in [CONTRIBUTING.md](../CONTRIBUTING.md).

> Follow these principles when implementing features. Preserve the existing architecture unless there is a clear technical justification and maintainer approval.

---

## Principles

- Server-first App Router architecture
- Separation of presentation, business logic, persistence, and integrations
- Nest-inspired backend layering when a database is used: controller → service → repository, colocated under `modules/<feature>/`
- Modular, reusable components
- Type-safe TypeScript
- Performance-, accessibility-, and SEO-conscious implementation
- Minimal client-side JavaScript
- Prefer native browser capabilities before JavaScript-based solutions
- Avoid blocking the critical rendering path with unnecessary resources
- Maintainable, scalable folder structure

---

## High-Level Flow

```text
User
  → Next.js application (pages, layouts, components)
    → App Router adapters (Server Actions, Route Handlers)
      → modules/<feature> (controller → service → repository) → Prisma / database
      → External integrations (CRM, analytics, others) via modules or lib
```

Typical mutating interaction path:

```text
User interaction → Validation → Route Handler / Server Action (adapter)
  → modules/<feature>/<feature>.controller
  → modules/<feature>/<feature>.service
  → modules/<feature>/<feature>.repository
  → Prisma
  → Response → UI update
```

Persistence rules, Prisma practices, and layer responsibilities: [BACKEND.md](./BACKEND.md).

---

## Project Structure

```text
app/
components/
hooks/
lib/              # shared helpers; Prisma singleton at lib/prisma.ts when backend is enabled
modules/          # feature modules: <feature>.controller|service|repository.ts
prisma/           # schema and migrations (when backend is enabled)
types/
utils/
public/
docs/
src/i18n/         # next-intl routing and request configuration
messages/         # locale dictionaries
```

| Directory     | Responsibility                                                                             |
| ------------- | ------------------------------------------------------------------------------------------ |
| `app/`        | Routes, pages, layouts, loading UI, error boundaries, thin Server Actions / Route Handlers |
| `components/` | Reusable UI; primarily presentational                                                      |
| `hooks/`      | Reusable React hooks                                                                       |
| `lib/`        | Shared application logic (SEO helpers, constants, validation, storage, `prisma` singleton) |
| `modules/`    | Feature backend: colocated `*.controller.ts`, `*.service.ts`, `*.repository.ts`            |
| `prisma/`     | Prisma schema and migrations                                                               |
| `types/`      | Shared TypeScript contracts and DTOs                                                       |
| `utils/`      | Pure helper functions                                                                      |
| `public/`     | Static assets                                                                              |
| `docs/`       | Project documentation                                                                      |
| `src/i18n/`   | Locale routing and next-intl configuration                                                 |
| `messages/`   | Translation dictionaries                                                                   |

When the project has no database, omit `prisma/`, `modules/`, and the Prisma singleton. Thin non-DB integration wrappers may live under `lib/<integration>/` if needed. See [BACKEND.md](./BACKEND.md).
---

## Rendering Strategy

**Server Components** are the default for static content, SEO pages, and data fetching.

**Client Components** are used only when required:

- Event handlers
- React state
- Browser APIs
- Interactive UI
- Client-side effects or libraries

Keep the Client Component boundary as small as possible. Prefer:

```text
Server Page
├── Static server content
└── Interactive client component
```

over converting an entire page or layout into a Client Component because one child needs interactivity.

Do not add `"use client"` to large trees unnecessarily.

---

## Component Architecture

```text
Page → Sections → Reusable components → Primitive UI
```

Single responsibility per component. Prefer composition over inheritance. Avoid embedding complex business logic in JSX; place it in `modules/<feature>/` (controller/service/repository). App Router files stay thin adapters.

---

## Backend layering (Prisma)

When persistence is enabled, follow Nest-style separation colocated by feature:

```text
modules/
  <feature>/
    <feature>.controller.ts
    <feature>.service.ts
    <feature>.repository.ts
```

```text
route.ts / actions.ts  →  *.controller.ts  →  *.service.ts  →  *.repository.ts  →  Prisma
```

- **Adapters** (`app/api/**/route.ts`, Server Actions): framework edge only; call the feature controller.
- **Controllers**: validate/map DTOs, choose response shape, invoke the feature service; never import Prisma.
- **Services**: business rules and use-cases; call the feature repository (and other modules’ services when needed).
- **Repositories**: Prisma only; no HTTP or UI imports.

Do not create separate top-level `controllers/`, `services/`, or `repositories/` directories. Full conventions: [BACKEND.md](./BACKEND.md).

---

## Data Fetching

Prefer server-side fetching and rendering:

```text
Server → Fetch data (via feature service) → Render page → Browser
```

over loading JavaScript first, then requesting data in the browser, when server fetching is appropriate.

- Avoid duplicate requests for the same data.
- Do not structure independent fetches as sequential waterfalls when they can run in parallel.
- Use Promise concurrency and Next.js data-fetching patterns deliberately.
- UI and Server Components must not import Prisma or repositories directly. Prefer the feature **service** for read-only server fetches; use the feature **controller** when an HTTP or Server Action boundary needs response shaping. See [BACKEND.md](./BACKEND.md).

Caching and revalidation conventions: [CACHING.md](./CACHING.md).
---

## Performance

Treat performance as part of architecture and component design, not only as a late optimization pass.

### JavaScript

Minimize JavaScript shipped to the browser. Do not add a dependency for behaviour that HTML, CSS, Server Components, or native APIs can provide.

### Images and media

- Use Next.js `<Image>` for application images where appropriate.
- Serve appropriately sized assets; prefer WebP or AVIF.
- Provide meaningful `alt` for informative images; empty `alt` for decorative ones.
- Avoid oversized background images.
- Do not eagerly load below-the-fold images.
- Prioritize important above-the-fold imagery.

Accessibility and `alt` rules: [SEO.md](./SEO.md).

### Layout stability (CLS)

Avoid elements shifting after render. Common causes: images without dimensions, ads without reserved space, late-injected content, font-driven reflow, and unknown component sizes. Use explicit dimensions or aspect ratios, reserve space for dynamic content, and follow font-loading guidance in [THEMING.md](./THEMING.md).

### Above-the-fold priority

Prioritize the main heading, hero content, primary image, navigation, and primary CTA. Do not delay critical content behind unnecessary client JavaScript.

### Lazy loading

Lazy-load or dynamically import below-the-fold images, heavy widgets, secondary analytics, and non-critical embeds. Do not lazy-load content that is immediately visible or critical to the first experience.

### Third-party scripts

Analytics, chat, social embeds, and marketing tools must be justified, deferred when possible, and measured. See [INTEGRATIONS.md](./INTEGRATIONS.md).

---

## Core Web Vitals

| Metric | Target   | Focus                                                                              |
| ------ | -------- | ---------------------------------------------------------------------------------- |
| LCP    | ≤ 2.5 s  | Hero imagery, server response, fonts, render-blocking resources, client JS         |
| INP    | ≤ 200 ms | Long tasks, expensive handlers, unnecessary client rendering and state updates     |
| CLS    | ≤ 0.1    | Image dimensions, reserved dynamic space, font loading, client-init layout changes |

Preload only genuinely critical resources.

---

## Next.js Conventions

- Prefer Server Components; introduce Client Components only when necessary.
- Use `next/image` for application-managed images.
- Use `next/font` for fonts ([THEMING.md](./THEMING.md)).
- Use the Metadata API for page metadata ([SEO.md](./SEO.md)).
- Use `next/link` for internal navigation; use the locale-aware navigation helpers for localized routes ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)).

---

## Integrations

Keep third-party logic out of presentational components. Prefer:

- `modules/<feature>/` when the integration is part of a domain feature
- `lib/<integration>/` for thin SDK wrappers shared across features
- `components/providers/` for client-only embeds when unavoidable
- Thin `app/**/actions.ts` / `app/api/**/route.ts` adapters that call module controllers

Do not treat external HTTP APIs as a substitute for repositories—repositories are for **this** application's database via Prisma. Registry and loading rules: [INTEGRATIONS.md](./INTEGRATIONS.md).
---

## State Management

Use the simplest option that fits:

1. Local component state
2. URL state
3. React Context when shared across a subtree
4. Server state

Do not introduce global client state libraries unless explicitly required.

---

## Styling

Tailwind CSS with semantic theme tokens. Do not hardcode theme-specific colours in components. Full specification: [THEMING.md](./THEMING.md).

---

## Cross-Cutting Concerns

| Concern                           | Expectation                                                                          | Spec                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Backend / Prisma                  | Feature modules under `modules/`; controller → service → repository; no Prisma in UI | [BACKEND.md](./BACKEND.md)                           |
| Internationalization              | Locale-prefixed routes via `next-intl`                                               | [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) |
| SEO, semantic HTML, accessibility | Metadata, landmarks, WCAG AA markup behaviour                                        | [SEO.md](./SEO.md)                                   |
| Caching / revalidation            | Intentional static, dynamic, and ISR choices                                         | [CACHING.md](./CACHING.md)                           |
| Environment / secrets             | Infisical only; never commit secrets                                                 | [ENVIRONMENT.md](./ENVIRONMENT.md)                   |
| Containers                        | Standalone Next image; Compose + Infisical env                                       | [DOCKER.md](./DOCKER.md)                             |
| Object storage / CDN              | R2 default; S3 via env; use `storageService` only                                    | [INTEGRATIONS.md](./INTEGRATIONS.md)                 |
| Performance / Core Web Vitals     | Server-first, optimized assets, minimal client JS                                    | This document                                        |
| Error handling                    | `withRouteHandler` on routes; fail gracefully                                        | [BACKEND.md](./BACKEND.md)                           |
| Security                          | Sanitize + validate input; least privilege for DB/integrations                       | BACKEND + ENVIRONMENT + INTEGRATIONS                 |
| Testing                           | Jest unit (Prisma mock) + integration (Infisical DB URL); Postman before commit      | [TESTING.md](./TESTING.md)                           |

---

## Performance Checklist

- [ ] Client Components limited to interactive requirements; client boundary kept small
- [ ] Images optimized with appropriate dimensions and formats
- [ ] Fonts loaded via `next/font` with required families/weights only
- [ ] Above-the-fold content prioritized; non-critical work deferred
- [ ] Layout shifts minimized
- [ ] No unnecessary request waterfalls or duplicate fetches
- [ ] Third-party scripts reviewed for critical-path impact
- [ ] Rendering/caching strategy intentional ([CACHING.md](./CACHING.md))
- [ ] Core Web Vitals within targets above

---

## Architectural Constraints

- Reuse or extend existing modules before creating new ones
- Avoid duplicate implementations
- Preserve backward compatibility unless instructed otherwise
- Follow the folder responsibilities above
- Keep components focused on a single responsibility

Significant architectural changes must be reflected in this file and noted in [CHANGELOG.md](./CHANGELOG.md).

---

## Related Documentation

- [README.md](../README.md) — project overview
- [SETUP.md](../SETUP.md) — local setup
- [CONTRIBUTING.md](../CONTRIBUTING.md) — standards and documentation map
- [BACKEND.md](./BACKEND.md)
- [CACHING.md](./CACHING.md)
- [THEMING.md](./THEMING.md)
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)
- [SEO.md](./SEO.md)
- [ENVIRONMENT.md](./ENVIRONMENT.md)
- [DOCKER.md](./DOCKER.md)
- [TESTING.md](./TESTING.md)
- [INTEGRATIONS.md](./INTEGRATIONS.md)
- [CHANGELOG.md](./CHANGELOG.md)
