import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    include: ['spec/**/*.js'],
    testTimeout: 15000,
    hookTimeout: 15000,
    coverage: {
      enabled: false,
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      cami: '../src/cami.js',
    },
  },
})
