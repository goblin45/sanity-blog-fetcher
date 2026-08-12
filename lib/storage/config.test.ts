import {
  buildPublicObjectUrl,
  resolveStorageEndpoint,
  resolveStorageProvider,
} from '@/lib/storage/config';

describe('resolveStorageProvider', () => {
  const original = process.env.STORAGE_PROVIDER;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.STORAGE_PROVIDER;
    } else {
      process.env.STORAGE_PROVIDER = original;
    }
  });

  it('defaults to r2 when unset', () => {
    delete process.env.STORAGE_PROVIDER;
    expect(resolveStorageProvider()).toBe('r2');
  });

  it('accepts s3', () => {
    process.env.STORAGE_PROVIDER = 's3';
    expect(resolveStorageProvider()).toBe('s3');
  });

  it('rejects unknown providers', () => {
    process.env.STORAGE_PROVIDER = 'gcs';
    expect(() => resolveStorageProvider()).toThrow(/Unsupported STORAGE_PROVIDER/);
  });
});

describe('resolveStorageEndpoint', () => {
  it('builds the R2 endpoint from account id', () => {
    expect(resolveStorageEndpoint('r2', 'abc123', undefined)).toBe(
      'https://abc123.r2.cloudflarestorage.com',
    );
  });

  it('returns undefined for S3 when no explicit endpoint', () => {
    expect(resolveStorageEndpoint('s3', undefined, undefined)).toBeUndefined();
  });

  it('prefers an explicit endpoint override', () => {
    expect(resolveStorageEndpoint('s3', undefined, 'https://s3.example.com/')).toBe(
      'https://s3.example.com',
    );
  });
});

describe('buildPublicObjectUrl', () => {
  it('joins base URL and key without duplicate slashes', () => {
    expect(buildPublicObjectUrl('https://cdn.example.com/', '/images/a.png')).toBe(
      'https://cdn.example.com/images/a.png',
    );
  });
});
