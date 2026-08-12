# Template → Working Repository Conversion

**One-time setup guide.** Use this file when a cloned instance of this starter template becomes a real project. After you finish the checklist below, **delete this file**. Nothing else in the repository depends on it—no permanent documentation map, README, or agent rule links here—so removal does not break inter-document links.

---

## Who this is for

Humans and AI agents converting a **fresh clone** of this Next.js + TypeScript (+ optional Prisma) starter into a business-specific repository.

**Intended workflow:** clone this private template repository → **delete the entire `.git` directory** (so template commit history is not carried into the project) → `git init` and add the **project** remote as `origin` → apply project-specific keep/remove and branding changes → push the converted baseline. Do **not** push project work back to the template repository.

## Preconditions

- This template ships **without** `node_modules` (keeps the archive lightweight).
- You must install dependencies before developing or building.
- You have (or will create) an empty project repository that should receive the converted code.

```bash
npm install
```

Then continue with [SETUP.md](./SETUP.md) (Infisical token, Husky, `npm run dev`).

---

## How to use this document

1. Clone the template from the private template remote (see **Git remotes** below).
2. Delete the full `.git` folder, re-initialize Git, and add the project repository as `origin` (fresh history—no template commits).
3. Decide which optional capabilities the project needs (table below).
4. Execute only the **Keep** or **Remove** path for each capability.
5. Replace template branding and project metadata.
6. Run install, generate clients if needed, and verify `lint` / `build`.
7. Delete **this file** (`TEMPLATE_CONVERSION.md`).
8. Commit the converted baseline and push to the project remote.

Do not leave half-removed features: either keep the capability and its docs, or remove code **and** update the documentation map so links stay accurate.

---

## Git remotes (always)

A normal `git clone` copies the template’s **entire commit history** inside `.git`. If you only change `origin` and push, that template history lands in the project repository. Always remove `.git` and start a new repository for the project.

```bash
# 1. Clone the private template
git clone <template-repository-url> <project-directory>
cd <project-directory>

# 2. Remove template Git metadata (full folder — required)
rm -rf .git

# 3. Start a fresh repository for this project
git init
git add .
# Optional: create the first commit after conversion work, or commit a snapshot now

# 4. Add the project remote (not the template)
git remote add origin <project-repository-url>

# 5. Verify origin is the project remote only
git remote -v
```

Never push conversion or product commits to the template remote. After conversion, commit and push the project baseline:

```bash
git add .
git commit -m "#1: Initialize project from starter template"
git push -u origin HEAD
```

Use the branch name your team requires (`main`, `master`, or a feature branch). Create the empty project repository on the host first if it does not exist yet. After `git init`, re-run `npm install` (or `npm run prepare`) and confirm `git config core.hooksPath` is `.husky/_` so Husky hooks work—see [SETUP.md](./SETUP.md).

---

## Capability decision matrix

| Capability                             | Keep when                                                               | Remove when                                              |
| -------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| **Backend + Prisma**                   | Persistence, APIs, Server Actions that mutate data, auth sessions in DB | Fully static / SSG marketing site with no database       |
| **Integrations**                       | CRM, analytics, chat, third-party embeds                                | No third-party scripts or external product APIs          |
| **Theming (`next-themes`)**            | Light/dark (or system) theme switching                                  | Single fixed visual theme with no runtime theme provider |
| **Internationalization (`next-intl`)** | Multiple locales or locale-prefixed routes                              | Single-language site                                     |
| **SEO helpers**                        | Public marketing / content site (almost always keep)                    | Internal tools where SEO docs/helpers are noise (rare)   |
| **Caching doc**                        | Any Next.js app (keep; fill in later)                                   | Never required to delete; leave as placeholder if unused |

Core always retained: Next.js App Router, TypeScript, Tailwind, ESLint/Prettier/Husky, Jest ([docs/TESTING.md](./docs/TESTING.md)), Docker ([docs/DOCKER.md](./docs/DOCKER.md)), [CONTRIBUTING.md](./CONTRIBUTING.md), [AGENTS.md](./AGENTS.md), [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md), [docs/CHANGELOG.md](./docs/CHANGELOG.md).

---

## 0. Bootstrap (always)

Complete **Git remotes** above (including **`rm -rf .git`** and `git init`) before treating this tree as the project repo.

```bash
npm install
```

1. Create local `.env` with `INFISICAL_TOKEN` only (see [SETUP.md](./SETUP.md)).
2. Confirm Husky hooks (`prepare` script / `core.hooksPath`).
3. Set `package.json` `name` to the real project slug.
4. Rewrite [README.md](./README.md) for the client/product (replace starter boilerplate).
5. Update primary objectives in [AGENTS.md](./AGENTS.md) to match the real product.

---

## 1. Backend + Prisma

Permanent rules live in [docs/BACKEND.md](./docs/BACKEND.md). Layering: **controller → service → repository** colocated under `modules/<feature>/` (Nest-style), with thin App Router adapters.

### Keep

1. Install Prisma and create the schema (if not already present):

   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```

2. Add folders and follow naming in [docs/BACKEND.md](./docs/BACKEND.md):

   ```text
   prisma/
   lib/prisma.ts              # singleton PrismaClient
   modules/
     <feature>/
       <feature>.controller.ts
       <feature>.service.ts
       <feature>.repository.ts
   types/                     # shared DTOs / domain contracts
   app/api/**/route.ts        # thin adapters → module controllers
   ```

3. Register `DATABASE_URL` (and any other DB vars) in Infisical and in [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md). Never put `DATABASE_URL` in the local `.env` (token only—see [SETUP.md](./SETUP.md)).
4. Add scripts to `package.json` that load secrets through Infisical (same wrapper as `dev` / `build` / `start`), for example:

   ```json
   "db:generate": "dotenv -- infisical run -- prisma generate",
   "db:migrate": "dotenv -- infisical run -- prisma migrate dev",
   "db:studio": "dotenv -- infisical run -- prisma studio"
   ```

5. Run `npm run db:generate` (or `dotenv -- infisical run -- npx prisma generate`) after schema changes; use migrations for shared environments. Bare `npx prisma …` will not receive Infisical secrets.
6. Keep [docs/BACKEND.md](./docs/BACKEND.md) in the documentation maps ([CONTRIBUTING.md](./CONTRIBUTING.md), [AGENTS.md](./AGENTS.md)).

### Remove

1. Delete (if present): `prisma/`, `lib/prisma.ts`, `modules/`, and any `app/api/**` routes that exist only for that backend.
2. Remove `@prisma/client`, `prisma`, and `db:*` scripts from `package.json`.
3. Delete [docs/BACKEND.md](./docs/BACKEND.md).
4. Remove Backend / Prisma rows and links from:
   - [AGENTS.md](./AGENTS.md) — Documentation Map, Tech Stack, Repository Structure
   - [CONTRIBUTING.md](./CONTRIBUTING.md) — Documentation Map and backend sections
   - [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — backend layer sections and related links
   - [SETUP.md](./SETUP.md) — Prisma / database steps
   - [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) — `DATABASE_URL` (and related vars)
5. Re-run `npm install` so the lockfile drops removed packages.
6. Ensure no remaining imports reference deleted modules.

---

## 2. Integrations

Registry: [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md).

### Keep

1. Replace placeholder integration sections with real integrations, or leave **Current Integrations** as “None” / delete unused stubs.
2. Isolate SDK/API calls under `modules/<feature>/` or `lib/<integration>/`—never inside presentational components.
3. Document each live integration before deploy (purpose, touchpoints, loading strategy, privacy).

### Remove

1. Delete integration-specific code under `modules/`, `lib/`, providers, and embeds.
2. Delete [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md) **or** leave a one-line “None” registry—prefer delete if the project will never use third parties.
3. Remove Integrations links/rows from AGENTS, CONTRIBUTING, ARCHITECTURE, SEO/performance checklists that point at that file, and SETUP “Next Steps” if present.
4. Drop unused npm packages (analytics SDKs, CRM clients, etc.).

---

## 3. Theming (`next-themes`)

Spec: [docs/THEMING.md](./docs/THEMING.md).

### Keep

1. Keep `components/providers/theme-provider.tsx` and semantic tokens in `app/globals.css`.
2. Adjust Release policy (forced light vs real dark) in THEMING and the provider.
3. Retain token-based Tailwind classes; do not hardcode theme colours in components.

### Remove

1. Remove `ThemeProvider` usage from layouts; render children without the provider.
2. Delete `components/providers/theme-provider.tsx` if unused.
3. Uninstall `next-themes`.
4. Simplify `app/globals.css` to a single static token set (no `.dark` / theme switching)—keep semantic CSS variables if useful for consistency.
5. Remove `suppressHydrationWarning` from `<html>` **only if** it was required solely for the theme script.
6. Delete [docs/THEMING.md](./docs/THEMING.md) and remove Theming links from AGENTS, CONTRIBUTING, ARCHITECTURE, SEO, and related “Related Documentation” lists.
7. Replace guidance that says “use theme tokens from THEMING” with “use project CSS variables / Tailwind theme” in AGENTS/CONTRIBUTING, or point at ARCHITECTURE styling section only.

---

## 4. Internationalization (`next-intl`)

Spec: [docs/INTERNATIONALIZATION.md](./docs/INTERNATIONALIZATION.md).

### Keep

1. Keep `src/i18n/`, `messages/`, `app/[locale]/`, `proxy.ts`, and the `next-intl` plugin in `next.config.ts`.
2. Trim `routing.locales` / dictionaries to the languages you ship.
3. Keep locale-aware SEO rules in [docs/SEO.md](./docs/SEO.md) aligned with real locales.

### Remove

Removing i18n is a structural change—do it carefully:

1. Uninstall `next-intl`.
2. Delete `src/i18n/`, `messages/`, and `proxy.ts` (locale middleware).
3. Move routes from `app/[locale]/...` to `app/...` (for example `app/(public)/page.tsx`, `app/layout.tsx` as the document shell).
4. Strip `createNextIntlPlugin` from `next.config.ts`; export a plain `nextConfig`.
5. Replace locale-aware `Link` / `useRouter` helpers with `next/link` and `next/navigation`.
6. Hardcode UI copy in components **or** a single non-i18n content module—do not leave `useTranslations` / `getTranslations` calls.
7. Delete [docs/INTERNATIONALIZATION.md](./docs/INTERNATIONALIZATION.md).
8. Remove i18n rows/links from AGENTS, CONTRIBUTING, ARCHITECTURE, SEO (locale sections), THEMING (script coverage notes), and SETUP.
9. Update [docs/SEO.md](./docs/SEO.md): drop `hreflang` / locale metadata requirements that no longer apply; keep the rest of SEO guidance.

---

## 5. SEO

Spec: [docs/SEO.md](./docs/SEO.md). Helpers: `lib/seo/`, `app/sitemap.ts`, `app/robots.ts`.

### Keep (recommended for public sites)

1. Set `NEXT_PUBLIC_SITE_URL` in Infisical / [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md).
2. Update site name, routes, and metadata for the real product.

### Remove (internal apps only)

1. Delete or gut `app/sitemap.ts`, `app/robots.ts`, and `lib/seo/` if unused.
2. Delete [docs/SEO.md](./docs/SEO.md) only if the product has no public SEO surface; otherwise keep accessibility sections or fold them into CONTRIBUTING.
3. Remove SEO doc links from maps; keep WCAG expectations in CONTRIBUTING/AGENTS even without SEO.md.

---

## 6. Caching

[docs/CACHING.md](./docs/CACHING.md) is a placeholder by design. Prefer **keeping** it and filling decisions as routes land. Remove only if you consciously collapse caching notes into ARCHITECTURE and update all links.

---

## 7. Project identity and docs hygiene

After capability choices:

1. Replace product name, organization name, and objectives in README, AGENTS, and any remaining starter boilerplate copy.
2. Align [docs/CHANGELOG.md](./docs/CHANGELOG.md) with a fresh “project initialized from template” entry (optional but useful).
3. Ensure every remaining file in Documentation Maps still exists on disk.
4. Grep for deleted doc filenames (`THEMING.md`, `INTERNATIONALIZATION.md`, `BACKEND.md`, `INTEGRATIONS.md`) and fix or remove stale links.
5. Confirm `npm run lint` and `npm run build` succeed.

---

## 8. Final step — delete this guide

```bash
rm TEMPLATE_CONVERSION.md
```

Verify no references remain:

```bash
rg -n 'TEMPLATE_CONVERSION' .
```

There should be **zero** matches. Permanent docs never required this file; if an agent added a temporary pointer during conversion, remove that pointer before finishing.

---

## Quick reference — files often touched

| Path                                 | Role                                                |
| ------------------------------------ | --------------------------------------------------- |
| `package.json` / `package-lock.json` | Name, deps, scripts                                 |
| `README.md`                          | Project identity                                    |
| `SETUP.md`                           | Install + env + optional Prisma                     |
| `AGENTS.md` / `CONTRIBUTING.md`      | Doc maps and standards                              |
| `docs/ARCHITECTURE.md`               | Structure and layers                                |
| `docs/BACKEND.md`                    | Prisma + controller/service/repository              |
| `docs/ENVIRONMENT.md`                | Env registry                                        |
| `docs/DOCKER.md`                     | Dockerfile / Compose / Infisical in containers      |
| `docs/TESTING.md`                    | Jest / mocks / Infisical test DB / Postman          |
| `docs/THEMING.md`                    | Theme (optional)                                    |
| `docs/INTERNATIONALIZATION.md`       | i18n (optional)                                     |
| `docs/INTEGRATIONS.md`               | Third parties (optional)                            |
| `docs/SEO.md`                        | SEO / a11y                                          |
| `next.config.ts` / `proxy.ts`        | i18n wiring                                         |
| `app/[locale]/`                      | Locale routes                                       |
| `prisma/` / `modules/<feature>/`     | Backend (colocated controller, service, repository) |

---

## Definition of done (conversion)

- [ ] Full `.git` from the template clone removed (`rm -rf .git`); fresh `git init` with project-only history
- [ ] `origin` is the **project** repository only (`git remote -v`); no template remote
- [ ] `npm install` completed; Husky hooks path set; app runs via `npm run dev`
- [ ] Capability keep/remove decisions applied consistently (code + docs + deps)
- [ ] Documentation maps contain only existing files
- [ ] Branding/objectives match the real project
- [ ] Backend kept ⇒ Prisma generate works; Backend removed ⇒ no Prisma leftovers
- [ ] `TEMPLATE_CONVERSION.md` deleted; `rg TEMPLATE_CONVERSION` is empty
- [ ] Converted baseline committed and pushed to the project remote (`git push -u origin HEAD`)
- [ ] Lint and production build pass
