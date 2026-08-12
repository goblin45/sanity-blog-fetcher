# Environment Variables

Registry of environment variables used by this project. Add new variables to the table below when they are introduced.

Contribution rules for requesting Infisical access and documenting variables: [CONTRIBUTING.md](../CONTRIBUTING.md). Local token setup: [SETUP.md](../SETUP.md).

## Required Variables

| Variable               | Description                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical production site origin for absolute SEO URLs in `sitemap.xml` and `robots.txt` (for example `https://www.example.com`). No trailing slash. |

## Database (when Prisma is enabled)

| Variable            | Description                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`      | Prisma connection string for the application database. Stored in Infisical only; never commit the value or place it in the local `.env`.                                                                                                 |
| `TEST_DATABASE_URL` | Optional connection string for Jest integration tests. Prefer a dedicated test database. When unset, integration tests may fall back to `DATABASE_URL` only if the team accepts sharing the dev database—see [TESTING.md](./TESTING.md). |

Document provider-specific extras (for example `DIRECT_URL` for pooled hosts) in this table when introduced. Persistence conventions: [BACKEND.md](./BACKEND.md).

## Observability (optional)

| Variable                | Description                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SLOW_API_THRESHOLD_MS` | Duration in milliseconds above which `withControllerEta` logs a slow-API warning. Defaults to `1000` when unset. |

## Object storage (Cloudflare R2 / Amazon S3)

S3-compatible object storage. Default provider is Cloudflare R2. Switch to Amazon S3 by setting `STORAGE_PROVIDER=s3` and adjusting region/keys—see [INTEGRATIONS.md](./INTEGRATIONS.md). All values live in Infisical only.

| Variable                    | Description                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `STORAGE_PROVIDER`          | `r2` (default) or `s3`.                                                                                             |
| `STORAGE_BUCKET`            | Bucket name.                                                                                                        |
| `STORAGE_ACCESS_KEY_ID`     | R2 API token access key id, or IAM access key id for S3.                                                            |
| `STORAGE_SECRET_ACCESS_KEY` | Matching secret access key.                                                                                         |
| `STORAGE_PUBLIC_BASE_URL`   | Public CDN / custom-domain origin for fetchable URLs (no trailing slash), for example `https://cdn.example.com`.    |
| `STORAGE_ACCOUNT_ID`        | Cloudflare account id (R2). Used to build `https://{id}.r2.cloudflarestorage.com` when `STORAGE_ENDPOINT` is unset. |
| `STORAGE_REGION`            | R2: typically `auto`. S3: bucket region (for example `us-east-1`).                                                  |
| `STORAGE_ENDPOINT`          | Optional full S3 API endpoint override.                                                                             |
| `STORAGE_FORCE_PATH_STYLE`  | Optional `true` / `false`. Defaults to `true` for R2 and `false` for S3 when unset.                                 |

## Secret Source

All application variables (including `DATABASE_URL`, `TEST_DATABASE_URL`, and storage credentials) are managed through Infisical. The local `.env` contains only `INFISICAL_TOKEN` so `dotenv -- infisical run -- …` can authenticate and inject secrets into the process environment for Next.js, Prisma CLI, Jest, and Docker Compose alike. Never commit secrets to the repository. Never bake secrets into Docker images—see [DOCKER.md](./DOCKER.md).
