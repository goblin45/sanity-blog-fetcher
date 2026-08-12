import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { buildPublicObjectUrl, getDefaultPresignExpiresSeconds } from '@/lib/storage/config';
import type {
  ObjectStorage,
  ObjectStorageConfig,
  PresignedDownloadInput,
  PresignedUploadInput,
  UploadObjectInput,
  UploadObjectResult,
} from '@/types/storage';

/**
 * Creates an AWS SDK S3 client configured for Cloudflare R2 or Amazon S3.
 *
 * @param config - Validated storage config from Infisical.
 * @returns Configured {@link S3Client}.
 */
export function createS3CompatibleClient(config: ObjectStorageConfig): S3Client {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

/**
 * S3-compatible {@link ObjectStorage} implementation used for both R2 and Amazon S3.
 * Provider differences are confined to {@link ObjectStorageConfig} (endpoint / region / path style).
 */
export class S3CompatibleObjectStorage implements ObjectStorage {
  readonly provider: ObjectStorageConfig['provider'];
  readonly bucket: string;

  private readonly client: S3Client;
  private readonly publicBaseUrl: string;

  /**
   * @param config - Resolved storage config.
   * @param client - Optional injected client (tests).
   */
  constructor(config: ObjectStorageConfig, client?: S3Client) {
    this.provider = config.provider;
    this.bucket = config.bucket;
    this.publicBaseUrl = config.publicBaseUrl;
    this.client = client ?? createS3CompatibleClient(config);
  }

  /**
   * @param input - Upload payload.
   * @returns Upload result with public URL.
   */
  async upload(input: UploadObjectInput): Promise<UploadObjectResult> {
    const response = await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
        CacheControl: input.cacheControl,
        Metadata: input.metadata,
      }),
    );

    return {
      key: input.key,
      publicUrl: this.getPublicUrl(input.key),
      etag: response.ETag,
    };
  }

  /**
   * @param key - Object key to delete.
   */
  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  /**
   * @param key - Object key.
   * @returns Public CDN URL.
   */
  getPublicUrl(key: string): string {
    return buildPublicObjectUrl(this.publicBaseUrl, key);
  }

  /**
   * @param input - Presign upload options.
   * @returns Presigned PUT URL.
   */
  async createPresignedUploadUrl(input: PresignedUploadInput): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      ContentType: input.contentType,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: input.expiresInSeconds ?? getDefaultPresignExpiresSeconds(),
    });
  }

  /**
   * @param input - Presign download options.
   * @returns Presigned GET URL.
   */
  async createPresignedDownloadUrl(input: PresignedDownloadInput): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: input.expiresInSeconds ?? getDefaultPresignExpiresSeconds(),
    });
  }
}
