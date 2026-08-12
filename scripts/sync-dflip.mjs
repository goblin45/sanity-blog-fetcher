/**
 * Copies DearFlip static assets from the npm package into `public/dflip`
 * so the Next.js app can serve CSS, JS, fonts, images, and sound files.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(
  root,
  'node_modules',
  '@dearhive',
  'dearflip-jquery-flipbook',
  'dflip',
);
const destination = join(root, 'public', 'dflip');

if (!existsSync(source)) {
  console.warn(
    '[sync-dflip] Package assets not found. Run npm install @dearhive/dearflip-jquery-flipbook first.',
  );
  process.exit(0);
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });
console.log('[sync-dflip] Copied DearFlip assets to public/dflip');
