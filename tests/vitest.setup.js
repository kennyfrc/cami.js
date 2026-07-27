// Ensure required polyfills
import '@webcomponents/custom-elements'
import 'fake-indexeddb/auto'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { afterEach, beforeEach } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const camiCode = readFileSync(resolve(__dirname, '../build/cami.cdn.js'), 'utf8')

// The CDN build creates a 'cami' variable via IIFE
// We need to capture it and assign to global
// Inject DOM globals to ensure CDN build can initialize properly
const scriptFn = new Function(
  'window',
  'global',
  'globalThis',
  'document',
  'customElements',
  camiCode + '; return cami;'
)
const cami = scriptFn(window, window, window, window.document, window.customElements)

// Make cami available globally
globalThis.cami = cami
window.cami = cami

// Minor stubs that several specs expect
globalThis.requestAnimationFrame = cb => setTimeout(cb, 0)
globalThis.cancelAnimationFrame = id => clearTimeout(id)
globalThis.performance ??= { now: () => Date.now() }

// Additional polyfills for common browser APIs
globalThis.requestIdleCallback = cb => setTimeout(cb, 1)
globalThis.cancelIdleCallback = id => clearTimeout(id)

// TrustedTypes polyfill for security-conscious code
globalThis.trustedTypes = {
  createPolicy: () => ({
    createHTML: s => s,
  }),
}

// Clear the DOM after each test
afterEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''

  // Clear the store cache to prevent test interference
  if (cami.clearStoreCache) {
    cami.clearStoreCache()
  }

  // Clear any custom elements that might have been defined
  // This helps prevent pollution between tests
  if (window.customElements && window.customElements._registry) {
    window.customElements._registry.clear()
  }
})
