# Testing

Jest is the testing framework for this repository. Full conventions: unit tests (Prisma mocked), integration tests (database URL from Infisical), and mandatory coverage for new or changed API routes/controllers.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Backend layering: [BACKEND.md](./BACKEND.md). Environment registry: [ENVIRONMENT.md](./ENVIRONMENT.md).

---

## Principles

- **Every new or modified API route / controller must ship with tests** in the same change. Agents and developers must not leave route work untested.
- Prefer **unit tests** for controllers and services with a **mocked Prisma** (or mocked repositories).
- Use **integration tests** when verifying real persistence or end-to-end module wiring against a database.
- Secrets and database URLs come from **Infisical** via `dotenv -- infisical run -- …`. Never put `DATABASE_URL` / `TEST_DATABASE_URL` in the local `.env`.
- Before each commit that touches API surfaces, manually exercise affected endpoints in **Postman** (or an equivalent HTTP client) in addition to automated tests.

---

## Tooling

| Tool        | Role                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Jest        | Test runner (`jest`, `jest-environment-jsdom`, `@types/jest` in `package.json`)                                   |
| `next/jest` | Built into the `next` package (not a separate npm dependency). Used in `jest.config.ts` for Next-aware transforms |
| Infisical   | Injects env for test scripts (same pattern as `dev` / `build`)                                                    |

### npm scripts

All test scripts load secrets through Infisical (local `.env` holds `INFISICAL_TOKEN` only):

```bash
npm test                 # unit tests (excludes *.integration.test.ts)
npm run test:watch       # unit tests in watch mode
npm run test:integration # integration tests only
npm run test:all         # unit + integration
npm run typecheck        # tsc --noEmit
```

Underlying pattern:

```bash
dotenv -- infisical run -- jest --testPathIgnorePatterns=integration
dotenv -- infisical run -- jest --testPathPattern=integration
```

Pre-commit runs unit tests, TypeScript check, and production build (see `.husky/pre-commit`).

---

## Layout

| Kind        | File pattern                     | Environment                 |
| ----------- | -------------------------------- | --------------------------- |
| Unit        | `**/*.test.ts` / `**/*.test.tsx` | Node; Prisma mocked         |
| Integration | `**/*.integration.test.ts`       | Node; real DB via Infisical |

Colocate unit tests next to the module under test when practical (for example `lib/api/sanitize.test.ts`, `modules/leads/leads.controller.test.ts`). Shared helpers live under `tests/helpers/` (for example `tests/helpers/prismaMock.ts`).

---

## Unit tests and Prisma mocks

Do **not** hit a real database in unit tests. Mock Prisma (or the repository) at the boundary:

```ts
import { createPrismaMock } from '@/tests/helpers/prismaMock';

const prismaMock = createPrismaMock();

jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
});
```

Extend `createPrismaMock()` with model delegates (`lead`, `user`, …) as features appear—each method should be a `jest.fn()`.

Assert controller/service behaviour against mock call arguments and return values. See [BACKEND.md](./BACKEND.md) for which layer to target.

---

## Integration tests and Infisical

Integration suites may use a dedicated test database **or** the same database as local development. Either way:

1. Store the connection string in Infisical (never in `.env`).
2. Prefer `TEST_DATABASE_URL` when a separate test database exists.
3. If `TEST_DATABASE_URL` is unset, fall back to `DATABASE_URL` only when the team explicitly accepts sharing the dev database for integration runs—document that choice in the PR or project notes.
4. Run migrations against the integration target before relying on schema (`dotenv -- infisical run -- npx prisma migrate deploy` or the project `db:*` scripts).
5. Clean or isolate data between tests so suites do not flake.

```ts
const connectionString = process.env.TEST_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(
    'TEST_DATABASE_URL or DATABASE_URL must be available via Infisical for integration tests.',
  );
}
```

Wire Prisma Client for integration tests to that URL (adapter / singleton as defined for the project). Do not invent a second secrets channel outside Infisical.

---

## What must be tested

When adding or changing an App Router route (`app/api/**/route.ts`) or module controller:

| Layer         | Minimum expectation                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Route adapter | Handler uses `withRouteHandler`; happy path and failure path covered (unit or thin integration) |
| Controller    | Wrapped with `withControllerEta`; unit tests with mocked service/Prisma                         |
| Service       | Business rules covered with mocked repository                                                   |
| Repository    | Prefer unit with Prisma mock; integration when query behaviour is non-trivial                   |

Sanitization of POST/PUT bodies (`sanitizeInput`) and centralized error handling are required by [BACKEND.md](./BACKEND.md)—cover them when those paths change.

---

## Postman (manual)

Automated tests do not replace a smoke pass against a running app:

1. Start the app (`npm run dev`) with Infisical-backed env.
2. For each new, modified, or affected controller/route, call the endpoint in Postman (correct method, headers, body).
3. Confirm status codes, response shape, and error cases you care about.
4. Do this **before committing** API changes.

---

## Related helpers

| Helper              | Path                           | Purpose                             |
| ------------------- | ------------------------------ | ----------------------------------- |
| `withRouteHandler`  | `lib/api/withRouteHandler.ts`  | Central try/catch for route methods |
| `sanitizeInput`     | `lib/api/sanitize.ts`          | Sanitize POST/PUT payloads          |
| `withControllerEta` | `lib/api/withControllerEta.ts` | Controller ETA / slow-API logging   |
| `logger`            | `lib/logging/logger.ts`        | Structured error and ETA logs       |
| `createPrismaMock`  | `tests/helpers/prismaMock.ts`  | Unit-test Prisma stub               |

---

## Definition of done (testing)

- [ ] New/changed routes and controllers have Jest coverage
- [ ] Unit tests mock Prisma; no accidental live DB in unit suite
- [ ] Integration tests (when used) load DB URL from Infisical
- [ ] Postman smoke completed for touched API surfaces
- [ ] `npm test` and `npm run typecheck` pass; pre-commit gates green
