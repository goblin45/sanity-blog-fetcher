import { logger } from '@/lib/logging/logger';

const DEFAULT_SLOW_API_THRESHOLD_MS = 1000;

/**
 * Resolves the slow-API threshold from Infisical-injected env, with a safe default.
 *
 * @returns Threshold in milliseconds.
 */
function getSlowApiThresholdMs(): number {
  const raw = process.env.SLOW_API_THRESHOLD_MS?.trim();
  if (!raw) {
    return DEFAULT_SLOW_API_THRESHOLD_MS;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SLOW_API_THRESHOLD_MS;
}

/**
 * Wraps a controller function with execution-time logging (ETA).
 * Logs duration on every call and emits a slow-API warning when duration exceeds the threshold.
 * Every exported controller entry point must be wrapped with this helper.
 *
 * @param operationName - Stable name for logs (for example `leads.create`).
 * @param handler - Controller function to time.
 * @returns Wrapped controller with the same call signature.
 */
export function withControllerEta<TArgs extends unknown[], TResult>(
  operationName: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const startedAt = performance.now();

    try {
      return await handler(...args);
    } finally {
      const durationMs = Math.round(performance.now() - startedAt);
      const thresholdMs = getSlowApiThresholdMs();

      logger.info('Controller ETA', {
        operation: operationName,
        durationMs,
        slow: durationMs >= thresholdMs,
      });

      if (durationMs >= thresholdMs) {
        logger.warn('Slow API detected', {
          operation: operationName,
          durationMs,
          thresholdMs,
        });
      }
    }
  };
}
