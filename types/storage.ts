/**
 * Object-storage contracts shared by Cloudflare R2 and Amazon S3 adapters.
 * Application code should depend on these types—not on provider SDKs.
 */

/** Supported object-storage backends. Both use the S3 API. */
export type StorageProvider = 'r2' | 's3';

/**
 * Resolved runtime configuration for an S3-compatible bucket.
 */
export interface ObjectStorageConfig {
  provider: StorageProvider;
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  /**
   * Public CDN / custom-domain base URL used to build fetchable asset URLs
   * (no trailing slash). Example: `https://cdn.example.com`.
   */
  publicBaseUrl: string;
  forcePathStyle: boolean;
}

/**
 * Input for uploading an object through the storage adapter.
 */
export interface UploadObjectInput {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
}

/**
 * Result of a successful upload.
 */
export interface UploadObjectResult {
  key: string;
  /** Public URL when `publicBaseUrl` is configured; otherwise empty string. */
  publicUrl: string;
  etag?: string;
}

/**
 * Input for creating a time-limited upload URL (browser / client PUT).
 */
export interface PresignedUploadInput {
  key: string;
  contentType: string;
  /** Seconds until the URL expires. Defaults to adapter policy (typically 900). */
  expiresInSeconds?: number;
}

/**
 * Input for creating a time-limited download URL for private objects.
 */
export interface PresignedDownloadInput {
  key: string;
  expiresInSeconds?: number;
}

/**
 * Provider-agnostic object storage port.
 * Swap R2 ↔ S3 by changing Infisical env (`STORAGE_PROVIDER` + related keys);
 * call sites keep using this interface.
 */
export interface ObjectStorage {
  readonly provider: StorageProvider;
  readonly bucket: string;

  /**
   * Uploads an object to the configured bucket.
   *
   * @param input - Object key, body, and content headers.
   * @returns Key, public URL, and optional ETag.
   */
  upload(input: UploadObjectInput): Promise<UploadObjectResult>;

  /**
   * Deletes an object by key. Missing keys are treated as success when the provider allows it.
   *
   * @param key - Object key to delete.
   */
  delete(key: string): Promise<void>;

  /**
   * Builds a public CDN URL for a key (does not check object existence).
   *
   * @param key - Object key.
   * @returns Absolute public URL.
   */
  getPublicUrl(key: string): string;

  /**
   * Creates a presigned PUT URL for direct client uploads.
   *
   * @param input - Key, content type, and optional TTL.
   * @returns Absolute presigned URL.
   */
  createPresignedUploadUrl(input: PresignedUploadInput): Promise<string>;

  /**
   * Creates a presigned GET URL for private object downloads.
   *
   * @param input - Key and optional TTL.
   * @returns Absolute presigned URL.
   */
  createPresignedDownloadUrl(input: PresignedDownloadInput): Promise<string>;
}
