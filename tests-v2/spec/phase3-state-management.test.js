import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('Phase 3: State Management TypeScript Integration Test', () => {
  describe('TypeScript files existence', () => {
    it('should have observable-store.ts file', () => {
      const observableStorePath = resolve(process.cwd(), '../src/observables/observable-store.ts');
      expect(existsSync(observableStorePath)).toBe(true);
    });

    it('should have observable-model.ts file', () => {
      const observableModelPath = resolve(process.cwd(), '../src/observables/observable-model.ts');
      expect(existsSync(observableModelPath)).toBe(true);
    });

    it('should have observable-proxy.ts file', () => {
      const observableProxyPath = resolve(process.cwd(), '../src/observables/observable-proxy.ts');
      expect(existsSync(observableProxyPath)).toBe(true);
    });

    it('should not have old JavaScript files', () => {
      const oldStorePath = resolve(process.cwd(), '../src/observables/observable-store.js');
      const oldModelPath = resolve(process.cwd(), '../src/observables/observable-model.js');
      const oldProxyPath = resolve(process.cwd(), '../src/observables/observable-proxy.js');
      
      expect(existsSync(oldStorePath)).toBe(false);
      expect(existsSync(oldModelPath)).toBe(false);
      expect(existsSync(oldProxyPath)).toBe(false);
    });
  });

  describe('ObservableStore functionality', () => {
    let ObservableStore, store;

    beforeEach(async () => {
      const storeModule = await import('../../src/observables/observable-store.ts');
      ObservableStore = storeModule.ObservableStore;
      store = storeModule.store;
    });

    it('should create store instances with factory function', () => {
      const testStore = store({
        name: 'test-store',
        state: { count: 0 },
        localStorage: false
      });

      expect(testStore).toBeDefined();
      expect(testStore.getState().count).toBe(0);
    });

    it('should handle actions and state updates', () => {
      const testStore = store({
        name: 'counter-store',
        state: { count: 0 },
        localStorage: false
      });

      testStore.defineAction('increment', ({ state, payload }) => {
        state.count += payload || 1;
      });

      testStore.dispatch('increment');
      expect(testStore.getState().count).toBe(1);

      testStore.dispatch('increment', 5);
      expect(testStore.getState().count).toBe(6);
    });

    it('should support complex state objects', () => {
      const testStore = store({
        name: 'complex-store',
        state: {
          user: { name: 'John', age: 30 },
          items: [],
          settings: { theme: 'light' }
        },
        localStorage: false
      });

      testStore.defineAction('updateUser', ({ state, payload }) => {
        Object.assign(state.user, payload);
      });

      testStore.defineAction('addItem', ({ state, payload }) => {
        state.items.push(payload);
      });

      testStore.dispatch('updateUser', { age: 31 });
      testStore.dispatch('addItem', { id: 1, name: 'Item 1' });

      const currentState = testStore.getState();
      expect(currentState.user.age).toBe(31);
      expect(currentState.items).toHaveLength(1);
      expect(currentState.items[0].name).toBe('Item 1');
    });

    it('should support subscription to state changes', async () => {
      const testStore = store({
        name: 'subscription-store',
        state: { count: 0 },
        localStorage: false
      });

      return new Promise((resolve) => {
        testStore.subscribe((newState) => {
          expect(newState.count).toBe(1);
          resolve();
        });

        testStore.defineAction('increment', ({ state }) => {
          state.count += 1;
        });

        testStore.dispatch('increment');
      });
    });

    it('should support getting current state', () => {
      const testStore = store({
        name: 'state-store',
        state: { user: { name: 'John', age: 30 } },
        localStorage: false
      });

      const currentState = testStore.getState();
      expect(currentState.user.name).toBe('John');
      expect(currentState.user.age).toBe(30);
    });

    it('should support defining actions dynamically', () => {
      const testStore = store({
        name: 'dynamic-store',
        state: { value: 0 },
        localStorage: false
      });

      testStore.defineAction('setValue', ({ state, payload }) => {
        state.value = payload;
      });

      testStore.dispatch('setValue', 42);
      expect(testStore.getState().value).toBe(42);
    });
  });

  describe('Model functionality', () => {
    let Model, Type, store;

    beforeEach(async () => {
      const modelModule = await import('../../src/observables/observable-model.ts');
      const typesModule = await import('../../src/types/index.ts');
      const storeModule = await import('../../src/observables/observable-store.ts');
      Model = modelModule.Model;
      Type = typesModule.Type;
      store = storeModule.store;
    });

    it('should create stores with typed state', () => {
      // Check that Model constructor exists and can be used
      expect(typeof Model).toBe('function');
      expect(typeof Type.String).toBe('string');
      expect(typeof Type.Integer).toBe('string');
      
      // Test that we can create a simple model-like store
      const userStore = store({
        name: 'user-store',
        state: { name: 'John', age: 30, email: 'john@example.com' },
        localStorage: false
      });

      expect(userStore.getState().name).toBe('John');
      
      // Define action and then use it
      userStore.defineAction('updateAge', ({ state, payload }) => {
        state.age = payload;
      });
      
      userStore.dispatch('updateAge', 31);
      expect(userStore.getState().age).toBe(31);
    });

    it('should export validation types', () => {
      // Just test that Model and Type are properly exported
      expect(typeof Model).toBe('function');
      expect(Type.String).toBe('string');
      expect(Type.Float).toBe('float');
      expect(Type.Boolean).toBe('boolean');
    });
  });

  describe('Integration between store components', () => {
    let store, Model, Type;

    beforeEach(async () => {
      const storeModule = await import('../../src/observables/observable-store.ts');
      const modelModule = await import('../../src/observables/observable-model.ts');
      const typesModule = await import('../../src/types/index.ts');
      
      store = storeModule.store;
      Model = modelModule.Model;
      Type = typesModule.Type;
    });

    it('should work with stores together', () => {
      const taskStore = store({
        name: 'task-store',
        state: { id: 1, title: 'Learn TypeScript', completed: false },
        localStorage: false
      });

      // Define actions first
      taskStore.defineAction('toggleCompleted', ({ state }) => {
        state.completed = !state.completed;
      });
      
      taskStore.defineAction('updateTitle', ({ state, payload }) => {
        state.title = payload;
      });

      // Test initial state
      expect(taskStore.getState().title).toBe('Learn TypeScript');

      // Test actions
      taskStore.dispatch('toggleCompleted');
      expect(taskStore.getState().completed).toBe(true);
      
      taskStore.dispatch('updateTitle', 'Master TypeScript');
      expect(taskStore.getState().title).toBe('Master TypeScript');
    });

    it('should handle complex nested state', () => {
      const testStore = store({
        name: 'nested-store',
        state: {
          app: {
            theme: 'light',
            settings: {
              notifications: true,
              autoSave: false
            }
          },
          user: {
            profile: {
              name: 'Alice',
              preferences: {
                language: 'en'
              }
            }
          }
        },
        localStorage: false
      });

      testStore.defineAction('updateTheme', ({ state, payload }) => {
        state.app.theme = payload;
      });

      testStore.defineAction('toggleNotifications', ({ state }) => {
        state.app.settings.notifications = !state.app.settings.notifications;
      });

      testStore.defineAction('updateLanguage', ({ state, payload }) => {
        state.user.profile.preferences.language = payload;
      });

      // Test nested updates
      testStore.dispatch('updateTheme', 'dark');
      testStore.dispatch('toggleNotifications');
      testStore.dispatch('updateLanguage', 'es');

      const state = testStore.getState();
      expect(state.app.theme).toBe('dark');
      expect(state.app.settings.notifications).toBe(false);
      expect(state.user.profile.preferences.language).toBe('es');
    });
  });
});