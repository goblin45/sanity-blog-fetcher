# Docker

Container build and Compose conventions for this starter. Secrets stay with Infisical—never bake `DATABASE_URL` or other secrets into images or commit them into Compose files.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Environment registry: [ENVIRONMENT.md](./ENVIRONMENT.md). Backend / Prisma: [BACKEND.md](./BACKEND.md).

---

## Files

| File                 | Role                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `Dockerfile`         | Multi-stage production image (`output: 'standalone'`)                   |
| `docker-compose.yml` | Local `db` (Postgres) + `app` services                                  |
| `.dockerignore`      | Keeps secrets, docs, tests, and `node_modules` out of the build context |

`next.config.ts` sets `output: 'standalone'` so the runner stage can copy `.next/standalone`.

---

## Secrets (Infisical)

- Local `.env` holds **`INFISICAL_TOKEN` only**.
- Do **not** put `DATABASE_URL` in Dockerfiles, Compose hardcoding, or image layers.
- Prefer injecting env into Compose from an Infisical-wrapped shell:

```bash
dotenv -- infisical run -- docker compose up --build
```

Compose maps `${DATABASE_URL}`, `${NEXT_PUBLIC_SITE_URL}`, and optional `${SLOW_API_THRESHOLD_MS}` into the `app` container from that process environment.

When the app runs **inside Compose** on the same network as `db`, Infisical `DATABASE_URL` should use host `db` (not `localhost`), for example:

```text
postgresql://postgres:postgres@db:5432/app
```

When only the database runs in Docker and the app runs on the host (`npm run dev`), use `localhost`:

```text
postgresql://postgres:postgres@localhost:5432/app
```

The Compose `POSTGRES_*` values seed the local Postgres container only. Align Infisical `DATABASE_URL` with those credentials for local Docker; production must use Infisical-managed production credentials.

---

## Build notes

- Image build runs `npx prisma generate` and `npx next build` (not `npm run build`, which wraps Infisical).
- Pass public build-time values as build args (Compose already forwards `NEXT_PUBLIC_SITE_URL`).
- `HUSKY=0` during `npm ci` so Git hooks are not installed in the image.
- Runtime command: `node server.js` on `0.0.0.0:3000`.

---

## Common commands

```bash
# App + Postgres (Infisical-injected env)
dotenv -- infisical run -- docker compose up --build

# Postgres only (app via npm run dev on the host)
docker compose up db -d

# Rebuild app image
dotenv -- infisical run -- docker compose build app

# Apply migrations against the Compose database (from host, Infisical-wrapped)
dotenv -- infisical run -- npx prisma migrate deploy
```

Stop and remove containers (keeps the named volume unless you pass `-v`):

```bash
docker compose down
```

---

## Production

- Build/push the image from CI; inject Infisical (or platform) secrets at **runtime**, not as image `ENV` baked at build.
- Do not set `HOSTNAME=localhost` in the container; the Dockerfile defaults to `0.0.0.0`.
- Run migrations as a release job (`prisma migrate deploy` with Infisical) before or alongside rolling out new app containers.
- Prefer a managed Postgres instance; the Compose `db` service is for local/dev convenience.

---

## Related documentation

- [SETUP.md](../SETUP.md) — local setup
- [ENVIRONMENT.md](./ENVIRONMENT.md) — variable registry
- [BACKEND.md](./BACKEND.md) — Prisma practices
- [TESTING.md](./TESTING.md) — Jest / test database URL
