import { loadObjectStorageConfig } from '@/lib/storage/config';
import { S3CompatibleObjectStorage } from '@/lib/storage/s3CompatibleObjectStorage';
import type { ObjectStorage } from '@/types/storage';

const globalForStorage = globalThis as unknown as {
  objectStorage?: ObjectStorage;
};

/**
 * Returns a process-wide {@link ObjectStorage} singleton (R2 or S3 via Infisical config).
 * Safe to call repeatedly under `next dev` hot reload.
 *
 * @returns Shared object-storage adapter.
 */
export function getObjectStorage(): ObjectStorage {
  if (!globalForStorage.objectStorage) {
    const config = loadObjectStorageConfig();
    globalForStorage.objectStorage = new S3CompatibleObjectStorage(config);
  }

  return globalForStorage.objectStorage;
}

/**
 * Creates a fresh adapter from current env (useful in tests). Prefer {@link getObjectStorage} in app code.
 *
 * @returns New {@link ObjectStorage} instance.
 */
export function createObjectStorage(): ObjectStorage {
  return new S3CompatibleObjectStorage(loadObjectStorageConfig());
}
