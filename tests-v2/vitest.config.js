import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: resolve(root, 'vitest.setup.js'),
    globals: true,
    include: ['spec/**/*.js'],
    coverage: {
      enabled: false,
      reporter: ['text', 'html']
    }
  },
  resolve: {
    alias: {
      cami: resolve(dirname(root), 'src/cami.js')
    }
  }
});