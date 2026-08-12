import type { ObjectStorageConfig, StorageProvider } from '@/types/storage';

const DEFAULT_PRESIGN_EXPIRES_SECONDS = 900;

/**
 * @returns Default presigned URL lifetime in seconds.
 */
export function getDefaultPresignExpiresSeconds(): number {
  return DEFAULT_PRESIGN_EXPIRES_SECONDS;
}

/**
 * Reads a required Infisical-injected environment variable.
 *
 * @param key - Env var name.
 * @returns Trimmed non-empty value.
 * @throws When the variable is missing or blank.
 */
function requireEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      `Missing required storage env var \`${key}\`. Register it in Infisical and docs/ENVIRONMENT.md.`,
    );
  }
  return value;
}

/**
 * Resolves the storage provider from env (`r2` default when unset).
 *
 * @returns Provider id.
 */
export function resolveStorageProvider(): StorageProvider {
  const raw = process.env.STORAGE_PROVIDER?.trim().toLowerCase();
  if (!raw || raw === 'r2') {
    return 'r2';
  }
  if (raw === 's3') {
    return 's3';
  }
  throw new Error(
    `Unsupported STORAGE_PROVIDER "${raw}". Use "r2" (Cloudflare R2) or "s3" (Amazon S3).`,
  );
}

/**
 * Builds the S3 API endpoint for the active provider.
 *
 * @param provider - `r2` or `s3`.
 * @param accountId - Cloudflare account id (required for R2 unless `STORAGE_ENDPOINT` is set).
 * @param explicitEndpoint - Optional full endpoint override from Infisical.
 * @returns Endpoint URL, or `undefined` for default AWS S3 regional endpoints.
 */
export function resolveStorageEndpoint(
  provider: StorageProvider,
  accountId: string | undefined,
  explicitEndpoint: string | undefined,
): string | undefined {
  if (explicitEndpoint) {
    return explicitEndpoint.replace(/\/$/, '');
  }

  if (provider === 'r2') {
    if (!accountId) {
      throw new Error(
        'STORAGE_ACCOUNT_ID is required for Cloudflare R2 (or set STORAGE_ENDPOINT).',
      );
    }
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }

  // Amazon S3: omit custom endpoint so the SDK uses the regional AWS endpoint.
  return undefined;
}

/**
 * Joins a public CDN base URL with an object key.
 *
 * @param publicBaseUrl - Origin without trailing slash.
 * @param key - Object key (leading slash optional).
 * @returns Absolute public URL.
 */
export function buildPublicObjectUrl(publicBaseUrl: string, key: string): string {
  const base = publicBaseUrl.replace(/\/$/, '');
  const normalizedKey = key.replace(/^\//, '');
  return `${base}/${normalizedKey}`;
}

/**
 * Loads object-storage config from Infisical-injected process env.
 * Call only on the server. Never commit these values to `.env`.
 *
 * @returns Validated {@link ObjectStorageConfig}.
 */
export function loadObjectStorageConfig(): ObjectStorageConfig {
  const provider = resolveStorageProvider();
  const bucket = requireEnv('STORAGE_BUCKET');
  const accessKeyId = requireEnv('STORAGE_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('STORAGE_SECRET_ACCESS_KEY');
  const publicBaseUrl = requireEnv('STORAGE_PUBLIC_BASE_URL').replace(/\/$/, '');

  const region = process.env.STORAGE_REGION?.trim() || (provider === 'r2' ? 'auto' : 'us-east-1');
  const accountId = process.env.STORAGE_ACCOUNT_ID?.trim();
  const explicitEndpoint = process.env.STORAGE_ENDPOINT?.trim();
  const endpoint = resolveStorageEndpoint(provider, accountId, explicitEndpoint);

  const forcePathStyleEnv = process.env.STORAGE_FORCE_PATH_STYLE?.trim().toLowerCase();
  const forcePathStyle =
    forcePathStyleEnv === 'true' || forcePathStyleEnv === '1'
      ? true
      : forcePathStyleEnv === 'false' || forcePathStyleEnv === '0'
        ? false
        : provider === 'r2';

  return {
    provider,
    bucket,
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl,
    forcePathStyle,
  };
}
