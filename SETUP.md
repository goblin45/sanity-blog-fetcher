# Project Setup Guide

Follow these steps to configure a local development environment for this repository.

Contribution standards, workflow, and links to architecture and feature documentation are in [CONTRIBUTING.md](./CONTRIBUTING.md).

> This repository is intended to ship **without** `node_modules`. Always run `npm install` (or `pnpm install`) after cloning or copying the template before any other command.

---

## Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- npm or pnpm
- Git
- A database whose `DATABASE_URL` is available via Infisical when using Prisma (see [docs/BACKEND.md](./docs/BACKEND.md))

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Required on every fresh clone or template copy:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Environment Variables

Create a single local `.env` file containing only the `INFISICAL_TOKEN` provided by an authorized project administrator.

Unless explicitly instructed, do not:

- Create additional `.env` files (for example `.env.local`, `.env.development`, `.env.production`)
- Modify, replace, or share the `INFISICAL_TOKEN` in your local `.env`
- Manually define project secrets in any `.env` file

All project secrets—including `DATABASE_URL` when persistence is enabled—are managed through Infisical. The registry of application environment variables is maintained in [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md).

### 4. Database (Prisma) — when backend is enabled

Skip this section for static sites with no database.

Do **not** put `DATABASE_URL` in the local `.env`. Prisma reads it from `process.env` after Infisical injects secrets (same pattern as `npm run dev`: `dotenv -- infisical run -- …`). The local `.env` stays `INFISICAL_TOKEN` only.

1. Confirm `DATABASE_URL` is available via Infisical for your scope.
2. Generate the Prisma Client after install or schema changes:

   ```bash
   dotenv -- infisical run -- npx prisma generate
   ```

3. Apply migrations for local development when the project uses migrate workflows:

   ```bash
   dotenv -- infisical run -- npx prisma migrate dev
   ```

Prefer `package.json` `db:*` scripts that use the same Infisical wrapper when the project defines them (see [TEMPLATE_CONVERSION.md](./TEMPLATE_CONVERSION.md) when converting the template).

Backend layering (`modules/<feature>/`: controller → service → repository) and Prisma practices: [docs/BACKEND.md](./docs/BACKEND.md).

### 5. Husky

`npm install` configures Husky automatically via the `prepare` script.

If Git hooks do not run, ensure `git config core.hooksPath` is set to `.husky/_`:

```bash
git config core.hooksPath .husky/_
```

If you reinitialize the local Git repository, run the same command again after reinitialization.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Tests

Jest scripts load secrets through Infisical (same wrapper as `dev`). Full policy: [docs/TESTING.md](./docs/TESTING.md).

```bash
npm test                 # unit tests (Prisma mocked)
npm run test:integration # integration tests (TEST_DATABASE_URL or DATABASE_URL from Infisical)
npm run typecheck
```

Register `TEST_DATABASE_URL` in Infisical when using a dedicated test database. Pre-commit runs unit tests, typecheck, and build.

### 8. Docker (optional)

Container images and Compose: [docs/DOCKER.md](./docs/DOCKER.md).

```bash
# Postgres only
docker compose up db -d

# App + Postgres with Infisical-injected env
dotenv -- infisical run -- docker compose up --build
```

When the app container talks to Compose `db`, set Infisical `DATABASE_URL` to use host `db` (not `localhost`).

---

## Next Steps

- [CONTRIBUTING.md](./CONTRIBUTING.md) — standards, workflow, and documentation map
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — application structure and performance
- [docs/BACKEND.md](./docs/BACKEND.md) — Prisma and feature modules (controller / service / repository)
- [docs/TESTING.md](./docs/TESTING.md) — Jest, mocks, Infisical-backed tests, Postman
- [docs/DOCKER.md](./docs/DOCKER.md) — Dockerfile and Compose
- [docs/CACHING.md](./docs/CACHING.md) — caching strategy (placeholder until configured)
- [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) — environment variable registry
