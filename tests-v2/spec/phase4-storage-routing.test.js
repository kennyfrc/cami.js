import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('Phase 4: Storage and Routing TypeScript Integration Test', () => {
  // Setup browser API mocks
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Mock window and location
    const mockLocation = {
      hash: '#',
      hostname: 'example.com',
      href: 'http://example.com/#'
    };
    
    Object.defineProperty(global, 'window', {
      value: {
        location: mockLocation,
        history: { pushState: vi.fn() },
        addEventListener: vi.fn(),
        document: { 
          querySelector: vi.fn(),
          querySelectorAll: vi.fn(() => []),
          getElementById: vi.fn(),
          title: ''
        }
      },
      writable: true
    });

    Object.defineProperty(global, 'document', {
      value: global.window.document,
      writable: true
    });
  });

  describe('TypeScript files existence', () => {
    it('should have adapters.ts file', () => {
      const adaptersPath = resolve(process.cwd(), 'src/storage/adapters.ts');
      expect(existsSync(adaptersPath)).toBe(true);
    });

    it('should have url-store.ts file', () => {
      const urlStorePath = resolve(process.cwd(), 'src/observables/url-store.ts');
      expect(existsSync(urlStorePath)).toBe(true);
    });

    it('should not have old JavaScript files', () => {
      const oldAdaptersPath = resolve(process.cwd(), 'src/storage/adapters.js');
      const oldUrlStorePath = resolve(process.cwd(), 'src/observables/url-store.js');
      
      expect(existsSync(oldAdaptersPath)).toBe(false);
      expect(existsSync(oldUrlStorePath)).toBe(false);
    });
  });

  describe('Storage adapters functionality', () => {
    let createLocalStorage, persistToLocalStorageThunk;

    beforeEach(async () => {
      const adaptersModule = await import('../../src/storage/adapters.ts');
      createLocalStorage = adaptersModule.createLocalStorage;
      persistToLocalStorageThunk = adaptersModule.persistToLocalStorageThunk;
      
      // Setup localStorage mock behavior
      const storage = {};
      global.localStorage.getItem.mockImplementation((key) => storage[key] || null);
      global.localStorage.setItem.mockImplementation((key, value) => { storage[key] = value; });
      global.localStorage.removeItem.mockImplementation((key) => { delete storage[key]; });
      global.localStorage.clear.mockImplementation(() => { 
        Object.keys(storage).forEach(key => delete storage[key]); 
      });
    });

    it('should create localStorage adapter with proper configuration', () => {
      const adapter = createLocalStorage({
        name: 'test-storage',
        version: 1
      });

      expect(adapter).toBeDefined();
      expect(adapter.name).toBe('test-storage');
      expect(adapter.version).toBe(1);
      expect(typeof adapter.getState).toBe('function');
      expect(typeof adapter.setState).toBe('function');
    });

    it('should handle localStorage state operations', async () => {
      // Setup proper localStorage mock for JSON operations
      const storage = {};
      global.localStorage.getItem.mockImplementation((key) => storage[key] || null);
      global.localStorage.setItem.mockImplementation((key, value) => { storage[key] = value; });
      global.localStorage.removeItem.mockImplementation((key) => { delete storage[key]; });
      
      const adapter = createLocalStorage({
        name: 'test-app',
        version: 1
      });

      // Test initial empty state
      const initialState = await adapter.getState();
      expect(initialState).toBeNull();

      // Test setting state
      const testState = { user: { name: 'Alice', id: 123 }, items: [1, 2, 3] };
      await adapter.setState(testState);

      // Test getting updated state
      const retrievedState = await adapter.getState();
      expect(retrievedState).toEqual(testState);
      expect(retrievedState.user.name).toBe('Alice');
      expect(retrievedState.items).toHaveLength(3);
    });

    it('should validate storage adapter configuration', () => {
      expect(() => createLocalStorage({ name: '', version: 1 }))
        .toThrow('name must be a non-empty string');

      expect(() => createLocalStorage({ name: 'test', version: 0 }))
        .toThrow('version must be a positive integer');

      expect(() => createLocalStorage({ name: 'test', version: -1 }))
        .toThrow('version must be a positive integer');
    });

    it('should handle localStorage persistence thunk', async () => {
      const adapter = createLocalStorage({
        name: 'persistence-test',
        version: 1
      });

      const thunk = persistToLocalStorageThunk(adapter);

      const initialState = { count: 0 };
      const newState = { count: 5 };

      // Test that thunk persists state changes
      await thunk({
        action: 'increment',
        state: newState,
        previousState: initialState
      });

      // Verify state was persisted
      const persistedState = await adapter.getState();
      expect(persistedState.count).toBe(5);
    });

    it('should skip persistence when state unchanged', async () => {
      const adapter = createLocalStorage({
        name: 'skip-test',
        version: 1
      });

      const thunk = persistToLocalStorageThunk(adapter);
      const sameState = { count: 10 };

      // Should not persist when state is the same
      await thunk({
        action: 'noop',
        state: sameState,
        previousState: sameState
      });

      // Should still be null since no change occurred
      const persistedState = await adapter.getState();
      expect(persistedState).toBeNull();
    });
  });

  describe('URL store functionality', () => {
    let createURLStore;

    beforeEach(async () => {
      const urlStoreModule = await import('../../src/observables/url-store.ts');
      createURLStore = urlStoreModule.createURLStore;

      // Reset location hash
      global.window.location.hash = '#';
    });

    it('should create URL store instance', () => {
      const urlStore = createURLStore();
      
      expect(urlStore).toBeDefined();
      expect(typeof urlStore.getState).toBe('function');
      expect(typeof urlStore.navigate).toBe('function');
      expect(typeof urlStore.registerRoute).toBe('function');
    });

    it('should parse URL state correctly', () => {
      // Since we're testing TypeScript conversion, focus on the API
      const urlStore = createURLStore();
      const state = urlStore.getState();

      // Test that state has correct TypeScript interface
      expect(state).toHaveProperty('hashPaths');
      expect(state).toHaveProperty('params');
      expect(state).toHaveProperty('hashParams');
      expect(Array.isArray(state.hashPaths)).toBe(true);
      expect(typeof state.params).toBe('object');
      expect(typeof state.hashParams).toBe('object');
    });

    it('should handle empty URL state', () => {
      const urlStore = createURLStore();
      const state = urlStore.getState();

      // Test basic TypeScript interface compliance
      expect(Array.isArray(state.hashPaths)).toBe(true);
      expect(typeof state.params).toBe('object');
      expect(typeof state.hashParams).toBe('object');
      expect(urlStore.isEmpty()).toBe(true);
    });

    it('should register routes with configuration', () => {
      const urlStore = createURLStore();
      
      const result = urlStore.registerRoute('/users/:id', {
        resources: ['userData'],
        params: { id: { persist: true } }
      });

      // Should return self for chaining
      expect(result).toBe(urlStore);
    });

    it('should register resource loaders', () => {
      const urlStore = createURLStore();
      const mockLoader = vi.fn();
      
      const result = urlStore.registerResourceLoader('userData', mockLoader);

      // Should return self for chaining
      expect(result).toBe(urlStore);
    });

    it('should support navigation hooks', () => {
      const urlStore = createURLStore();
      const beforeHook = vi.fn();
      const afterHook = vi.fn();
      
      const result1 = urlStore.beforeNavigate(beforeHook);
      const result2 = urlStore.afterNavigate(afterHook);

      // Should return self for chaining
      expect(result1).toBe(urlStore);
      expect(result2).toBe(urlStore);
    });

    it('should check loading state', () => {
      const urlStore = createURLStore();
      
      // Initially should not be loading
      expect(urlStore.isLoading()).toBe(false);
    });

    it('should match URL state slices', () => {
      const urlStore = createURLStore();
      
      // Test TypeScript interface for matches method
      expect(typeof urlStore.matches).toBe('function');
      
      // Should handle empty matches
      expect(urlStore.matches({})).toBe(true);
      
      // Test that matches accepts proper TypeScript interface
      const result = urlStore.matches({
        hashPaths: [],
        params: {},
        hashParams: {}
      });
      expect(typeof result).toBe('boolean');
    });

    it('should detect empty URL state', () => {
      const urlStore = createURLStore();
      
      // Test isEmpty method TypeScript interface
      expect(typeof urlStore.isEmpty).toBe('function');
      const isEmpty = urlStore.isEmpty();
      expect(typeof isEmpty).toBe('boolean');
    });

    it('should handle navigation with options', () => {
      const urlStore = createURLStore();
      
      // Should not throw when calling navigate
      expect(() => {
        urlStore.navigate({
          path: 'users/123',
          params: { tab: 'profile' },
          pageTitle: 'User Profile'
        });
      }).not.toThrow();
    });
  });

  describe('Integration between storage and routing', () => {
    let createURLStore, createLocalStorage;

    beforeEach(async () => {
      const urlStoreModule = await import('../../src/observables/url-store.ts');
      const adaptersModule = await import('../../src/storage/adapters.ts');
      
      createURLStore = urlStoreModule.createURLStore;
      createLocalStorage = adaptersModule.createLocalStorage;

      // Reset location
      global.window.location.hash = '#';
      global.window.location.hostname = 'test.com';
      global.window.location.href = 'http://test.com/#';
    });

    it('should work together for persisting routing state', async () => {
      // Setup localStorage mock for this specific test
      const storage = {};
      global.localStorage.getItem.mockImplementation((key) => storage[key] || null);
      global.localStorage.setItem.mockImplementation((key, value) => { storage[key] = value; });
      
      const urlStore = createURLStore();
      const storageAdapter = createLocalStorage({
        name: 'app-routing',
        version: 1
      });

      // Get initial URL state
      const urlState = urlStore.getState();
      
      // Persist URL state to localStorage
      await storageAdapter.setState({
        currentRoute: urlState,
        navigationHistory: [urlState]
      });

      // Retrieve persisted state
      const persistedState = await storageAdapter.getState();
      
      expect(persistedState.currentRoute).toEqual(urlState);
      expect(persistedState.navigationHistory).toHaveLength(1);
    });

    it('should handle complex routing with persistent storage', async () => {
      // Setup localStorage mock
      const storage = {};
      global.localStorage.getItem.mockImplementation((key) => storage[key] || null);
      global.localStorage.setItem.mockImplementation((key, value) => { storage[key] = value; });
      
      const urlStore = createURLStore();
      const storageAdapter = createLocalStorage({
        name: 'complex-routing',
        version: 1
      });

      // Register a route with resources - test TypeScript interfaces
      urlStore.registerRoute('/app/:section', {
        resources: ['appData'],
        params: { section: { persist: true } }
      });

      // Register a resource loader - test TypeScript interfaces
      urlStore.registerResourceLoader('appData', async (context) => {
        // Verify context has proper TypeScript interface
        expect(context).toHaveProperty('route');
        expect(context).toHaveProperty('params');
        expect(context).toHaveProperty('url');
      });

      // Verify storage adapter works
      const testData = { user: 'test', settings: { theme: 'dark' } };
      await storageAdapter.setState(testData);
      
      const retrieved = await storageAdapter.getState();
      expect(retrieved.user).toBe('test');
      expect(retrieved.settings.theme).toBe('dark');
    });

    it('should support route-based caching with storage', async () => {
      // Setup localStorage mock
      const storage = {};
      global.localStorage.getItem.mockImplementation((key) => storage[key] || null);
      global.localStorage.setItem.mockImplementation((key, value) => { storage[key] = value; });
      
      const storageAdapter = createLocalStorage({
        name: 'route-cache',
        version: 1
      });

      // Simulate caching route data
      const routeData = {
        '/users': { users: ['Alice', 'Bob'], lastFetch: Date.now() },
        '/settings': { preferences: { theme: 'light' }, lastFetch: Date.now() }
      };

      await storageAdapter.setState({ routeCache: routeData });

      const cached = await storageAdapter.getState();
      expect(cached.routeCache['/users'].users).toEqual(['Alice', 'Bob']);
      expect(cached.routeCache['/settings'].preferences.theme).toBe('light');
    });
  });
});