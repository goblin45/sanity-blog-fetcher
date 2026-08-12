import { withControllerEta } from '@/lib/api/withControllerEta';
import { getObjectStorage } from '@/lib/storage/createObjectStorage';
import type {
  PresignedDownloadInput,
  PresignedUploadInput,
  UploadObjectInput,
  UploadObjectResult,
} from '@/types/storage';

/**
 * Application-facing storage operations (upload / fetch URLs / delete).
 * Feature modules and route adapters should call this service—not `@aws-sdk/*` directly.
 */
export const storageService = {
  /**
   * Uploads an object through the configured R2/S3 adapter.
   *
   * @param input - Upload payload.
   * @returns Upload result including public URL.
   */
  upload: withControllerEta(
    'storage.upload',
    async (input: UploadObjectInput): Promise<UploadObjectResult> => {
      return getObjectStorage().upload(input);
    },
  ),

  /**
   * Deletes an object by key.
   *
   * @param key - Object key.
   */
  delete: withControllerEta('storage.delete', async (key: string): Promise<void> => {
    await getObjectStorage().delete(key);
  }),

  /**
   * Resolves the public CDN URL for a key (no network I/O).
   *
   * @param key - Object key.
   * @returns Public URL string.
   */
  getPublicUrl(key: string): string {
    return getObjectStorage().getPublicUrl(key);
  },

  /**
   * Creates a presigned upload URL for direct-to-bucket client uploads.
   *
   * @param input - Presign options.
   * @returns Presigned PUT URL.
   */
  createPresignedUploadUrl: withControllerEta(
    'storage.createPresignedUploadUrl',
    async (input: PresignedUploadInput): Promise<string> => {
      return getObjectStorage().createPresignedUploadUrl(input);
    },
  ),

  /**
   * Creates a presigned download URL for private objects.
   *
   * @param input - Presign options.
   * @returns Presigned GET URL.
   */
  createPresignedDownloadUrl: withControllerEta(
    'storage.createPresignedDownloadUrl',
    async (input: PresignedDownloadInput): Promise<string> => {
      return getObjectStorage().createPresignedDownloadUrl(input);
    },
  ),
};
