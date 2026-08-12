# Next.js + TypeScript + Prisma Starter Template

A production-oriented starter for App Router projects: TypeScript, Tailwind CSS, optional Prisma backend, internationalization, theming, SEO helpers, and documented engineering conventions.

Replace this README with project-specific identity during template conversion (see `TEMPLATE_CONVERSION.md`).

---

## About

This repository is a **starter template**, not a finished product. Copy it, choose which capabilities to keep, and adapt branding, objectives, and integrations for the real application.

Built for:

- Server-first Next.js App Router applications
- Strict TypeScript and clear folder boundaries
- Optional persistence via Prisma (`modules/<feature>/` controller → service → repository)
- Accessible, performant, SEO-friendly public sites (when those concerns apply)

---

## Included capabilities

| Area                                             | Status                       |
| ------------------------------------------------ | ---------------------------- |
| Next.js App Router + React + TypeScript          | Core                         |
| Tailwind CSS + semantic theme tokens             | Core                         |
| next-intl (locale routing)                       | Optional — removable         |
| next-themes                                      | Optional — removable         |
| Prisma + feature modules                         | Optional — enable or remove  |
| SEO helpers (`sitemap`, `robots`, `lib/seo`)     | Recommended for public sites |
| Infisical-backed env loading                     | Core (secrets workflow)      |
| Jest + Husky pre-commit (test, typecheck, build) | Core                         |
| Docker (standalone image + Compose)              | Core                         |
| Husky + Prettier                                 | Core                         |

One-time keep/remove instructions: [TEMPLATE_CONVERSION.md](./TEMPLATE_CONVERSION.md).

---

## Technology stack

| Category        | Technology                           |
| --------------- | ------------------------------------ |
| Framework       | Next.js (App Router)                 |
| Language        | TypeScript                           |
| UI              | React                                |
| Styling         | Tailwind CSS                         |
| ORM             | Prisma (when persistence is enabled) |
| i18n            | next-intl (when enabled)             |
| Secrets         | Infisical                            |
| Testing         | Jest                                 |
| Containers      | Docker / Compose                     |
| Version control | Git                                  |

---

## Architecture principles

- Modular, reusable UI components
- Server-first rendering
- Nest-inspired backend layering under `modules/<feature>/` when using Prisma
- Type-safe TypeScript
- Performance, accessibility (WCAG AA), and SEO treated as first-class concerns
- Scalable folder structure

Details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/BACKEND.md](./docs/BACKEND.md).

---

## Getting started

This template ships **without** `node_modules`. Install before developing:

```bash
npm install
npm run dev
```

Full setup (Infisical, Husky, optional Prisma): [SETUP.md](./SETUP.md).

---

## Contributing

Standards, workflow, and the documentation map: [CONTRIBUTING.md](./CONTRIBUTING.md).

Agent operating rules: [AGENTS.md](./AGENTS.md).

---

## License

Replace this section with the license or engagement terms that apply to your project copy of the template.

© 2026 — All rights reserved (update for your organization).
