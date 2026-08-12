import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/**
 * Shared Jest config for unit and integration suites.
 * Select suites via npm scripts (`test` vs `test:integration`), not separate projects,
 * so `next/jest` path aliases and transforms stay consistent.
 */
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/.agents/',
    '<rootDir>/.claude/',
    '<rootDir>/.windsurf/',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.tsx',
    '<rootDir>/**/*.integration.test.ts',
  ],
};

export default createJestConfig(config);
