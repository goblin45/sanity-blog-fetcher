# Backend and Prisma

Backend conventions for this repository: Nest-inspired **controller → service → repository** layering on top of the Next.js App Router, with **Prisma** as the persistence layer.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Structural context: [ARCHITECTURE.md](./ARCHITECTURE.md). Environment variables: [ENVIRONMENT.md](./ENVIRONMENT.md).

> If this project has no database, remove `modules/`, `prisma/`, the Prisma singleton, and this document during template conversion (see the one-time conversion guide shipped with the template). Do not leave dead Prisma dependencies in `package.json`.

---

## Layering

```text
App Router adapter (Route Handler or Server Action)
  → Controller   — request/response orchestration, DTO mapping, status decisions
    → Service    — business rules, use-cases, transactions coordination
      → Repository — Prisma queries only; no business policy
        → Prisma Client / Database
```

| Layer            | File pattern             | May import                         | Must not                         |
| ---------------- | ------------------------ | ---------------------------------- | -------------------------------- |
| Adapter          | `app/api/**/route.ts`, `**/actions.ts` | Controllers                        | Prisma, repositories, raw SQL    |
| Controller       | `*.controller.ts`        | Services, types, validators        | PrismaClient, SQL                |
| Service          | `*.service.ts`           | Repositories, other services, types | PrismaClient directly (prefer repos) |
| Repository       | `*.repository.ts`        | Prisma client, types               | HTTP, UI, framework request APIs |

Presentational components never call repositories or Prisma. Pages and UI call Server Actions / loaders that go through controllers (or services for read-only server fetches when no HTTP shape is needed—still skip Prisma in the UI layer).

---

## Directory layout

Colocate each feature under `modules/`. Do **not** create separate top-level `controllers/`, `services/`, or `repositories/` folders.

```text
prisma/
  schema.prisma
  migrations/
lib/
  prisma.ts                 # shared PrismaClient singleton
modules/
  <feature>/
    <feature>.controller.ts
    <feature>.service.ts
    <feature>.repository.ts
types/
  <feature>.ts              # DTOs / domain interfaces (or next to the module when private)
app/
  api/
    <resource>/
      route.ts              # thin adapter → modules/<feature>/<feature>.controller
```

Example:

```text
modules/
  leads/
    leads.controller.ts
    leads.service.ts
    leads.repository.ts
  users/
    users.controller.ts
    users.service.ts
    users.repository.ts
```

Cross-feature imports go through the other module’s public exports (prefer service-to-service). Do not reach into another feature’s repository from outside that module unless there is a clear, documented exception.

---

## Prisma practices

### Client singleton

Instantiate Prisma once for the process (especially under `next dev` hot reload). Export a single client from `lib/prisma.ts` and import it only from repositories.

```ts
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Shared Prisma client for server-side data access.
 * Reuses the instance across hot reloads in development.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

Import from the generator `output` path (`generated/prisma`), not `@prisma/client`. The `@prisma/client` package remains a runtime dependency.

### Schema and migrations

- Keep the canonical schema in `prisma/schema.prisma`.
- Generator `output` must be `../generated/prisma` (repo-root `generated/prisma/`); keep `/generated/prisma` in `.gitignore`.
- Use migrations (`prisma migrate`) for shared and deployed environments; do not rely on `db push` alone for production.
- Run `prisma generate` after schema changes (CI and local) through Infisical—same wrapper as app scripts. Document any required scripts in [SETUP.md](../SETUP.md).
- Model names and fields should match domain language used in TypeScript types.

### Repository rules

- One repository per aggregate/entity (or cohesive query surface).
- Repositories translate between Prisma models and domain/DTO types when the two diverge.
- No HTTP status codes, no session cookies, no “if unauthorized” policy beyond data existence checks that the service owns.
- Catch Prisma errors only when mapping them to domain failures the service understands; otherwise let the service handle outcomes.

### Service rules

- Encode business invariants, authorization checks that are domain policy, and multi-step workflows.
- Orchestrate multiple repositories when needed; keep transactions in the service (via Prisma `$transaction` passed through or invoked with repository methods that accept a transactional client when required).
- Return domain results or typed errors; do not leak Prisma error objects to adapters.

### Controller rules

- Accept already-parsed input from the adapter (or parse/validate here with a shared validator).
- Map results to the shape the adapter needs (JSON body, redirect decision, action state).
- Stay free of JSX and free of Prisma.
- **Every exported controller entry point must be wrapped with `withControllerEta`** from `lib/api/withControllerEta.ts` so execution time and slow APIs are logged from the entry point.

```ts
import { withControllerEta } from '@/lib/api/withControllerEta';

export const createLead = withControllerEta('leads.create', async (dto) => {
  // ...
});
```

### Adapter rules (Route Handlers / Server Actions)

- Stay thin: auth gate at the edge if framework-specific, then call the controller.
- **Wrap every exported route method** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with `withRouteHandler` from `lib/api/withRouteHandler.ts` (centralized try/catch). Do not rely on ad-hoc try/catch per handler unless adding extra domain-specific mapping inside the wrapped body.
- **Sanitize all POST/PUT (and PATCH) payloads** with `sanitizeInput` from `lib/api/sanitize.ts` before validation and before calling the controller.
- Validate and sanitize input before or inside the controller; never trust raw client payloads.
- Do not expose internal error details to clients; log server-side with enough context to debug (`lib/logging/logger.ts`).

```ts
import { NextResponse } from 'next/server';

import { sanitizeInput } from '@/lib/api/sanitize';
import { withRouteHandler } from '@/lib/api/withRouteHandler';
import { createLead } from '@/modules/leads/leads.controller';

export const POST = withRouteHandler(async (request) => {
  const body = sanitizeInput(await request.json());
  const result = await createLead(body);
  return NextResponse.json(result, { status: 201 });
});
```

---

## Exception handling

- Route adapters: always `withRouteHandler` (central try/catch → log → safe 500 JSON).
- Controllers/services: throw or return typed domain errors; do not swallow exceptions.
- Never leak stack traces, Prisma codes, or connection strings to clients.
- Log failures with `logger.error` including method, URL/operation name, and safe error fields.

## Data sanitization

- Apply `sanitizeInput` to every mutating JSON/form body (POST/PUT/PATCH) at the adapter boundary.
- Follow with schema/validation (shared validators)—sanitization is not a substitute for validation.
- For rich HTML content, introduce a dedicated HTML sanitizer and document it in [INTEGRATIONS.md](./INTEGRATIONS.md) / [TESTING.md](./TESTING.md); the default helper targets plain string/object payloads.

## Logging and performance (ETA)

- Controllers: wrap every entry point with `withControllerEta(operationName, handler)`.
- The wrapper logs duration on each call and warns when duration ≥ `SLOW_API_THRESHOLD_MS` (Infisical; default 1000 ms).
- Prefer the shared `logger` over raw `console` in server modules.

---

## Naming

- Feature folder: `modules/<feature>/` (plural domain names preferred when natural: `leads`, `users`)
- Files: `camelCase` with suffix — `<feature>.repository.ts`, `<feature>.service.ts`, `<feature>.controller.ts`
- Exports: named exports preferred (`leadsRepository`, `createLead`, or class-style `LeadsRepository` if the codebase standardizes on classes—pick one style per project and stay consistent)
- Avoid `any`; share cross-cutting DTOs under `types/`, or keep feature-private types beside the module

---

## Example flow (illustrative)

```text
POST /api/leads
  app/api/leads/route.ts
    → modules/leads/leads.controller.ts  → validate → leadsService.create(dto)
      → modules/leads/leads.service.ts     → policy → leadsRepository.create(data)
        → modules/leads/leads.repository.ts → prisma.lead.create(...)
```

---

## Security and environment

- `DATABASE_URL` (and provider-specific vars) live in Infisical only; register them in [ENVIRONMENT.md](./ENVIRONMENT.md).
- Never put `DATABASE_URL` (or other secrets) in the local `.env`. That file holds `INFISICAL_TOKEN` only; Infisical injects application secrets at runtime.
- Run Prisma CLI through the same Infisical wrapper as app scripts (`dotenv -- infisical run -- …` or project `db:*` scripts). `prisma.config.ts` reads `process.env.DATABASE_URL` after Infisical has injected it—do not treat dotenv / a committed `.env` as the source of the connection string.
- Never commit `.env` files or connection strings.
- Principle of least privilege for database users in staging/production.
- Validate all mutating inputs at the adapter/controller boundary.

---

## Testing expectations

Full policy: [TESTING.md](./TESTING.md).

- Prefer unit tests on controllers/services with **mocked Prisma** (`tests/helpers/prismaMock.ts`) or mocked repositories.
- Integration tests use `TEST_DATABASE_URL` or `DATABASE_URL` from **Infisical** only; run via `npm run test:integration`.
- **Every new or modified route/controller must include Jest tests** in the same change.
- Exercise affected endpoints in **Postman** before committing API changes.
- Do not require spinning up the full Next.js UI to verify domain logic in unit tests.

---

## Related documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — overall structure and rendering
- [ENVIRONMENT.md](./ENVIRONMENT.md) — variable registry
- [TESTING.md](./TESTING.md) — Jest, mocks, Infisical-backed integration tests, Postman
- [CACHING.md](./CACHING.md) — caching implications of dynamic data
- [INTEGRATIONS.md](./INTEGRATIONS.md) — external APIs (not a substitute for repositories)
- [SETUP.md](../SETUP.md) — local database setup steps
- [CONTRIBUTING.md](../CONTRIBUTING.md) — contribution standards
- [AGENTS.md](../AGENTS.md) — agent operating rules (keep in sync with CONTRIBUTING)
