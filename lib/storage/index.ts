/**
 * Public entry for object storage (Cloudflare R2 by default; Amazon S3 via env switch).
 * Server-only — do not import from Client Components.
 */

export {
  buildPublicObjectUrl,
  getDefaultPresignExpiresSeconds,
  loadObjectStorageConfig,
  resolveStorageEndpoint,
  resolveStorageProvider,
} from '@/lib/storage/config';
export { createObjectStorage, getObjectStorage } from '@/lib/storage/createObjectStorage';
export { storageService } from '@/lib/storage/storage.service';
export { S3CompatibleObjectStorage } from '@/lib/storage/s3CompatibleObjectStorage';
export type {
  ObjectStorage,
  ObjectStorageConfig,
  PresignedDownloadInput,
  PresignedUploadInput,
  StorageProvider,
  UploadObjectInput,
  UploadObjectResult,
} from '@/types/storage';
