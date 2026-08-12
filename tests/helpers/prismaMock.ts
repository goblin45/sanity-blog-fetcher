import { jest } from '@jest/globals';

/**
 * Lightweight Prisma client mock for unit tests.
 * Extend model keys as features add repositories; keep methods as `jest.fn()`.
 *
 * @returns A mutable mock object suitable for `jest.mock` wiring.
 */
export function createPrismaMock() {
  return {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(async (fn: (tx: unknown) => unknown) => fn({})),
  };
}

export type PrismaMock = ReturnType<typeof createPrismaMock>;
