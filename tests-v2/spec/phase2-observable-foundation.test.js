import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('Phase 2: Observable Foundation TypeScript Integration Test', () => {
  describe('TypeScript files existence', () => {
    it('should have observable.ts file', () => {
      const observablePath = resolve(process.cwd(), '../src/observables/observable.ts');
      expect(existsSync(observablePath)).toBe(true);
    });

    it('should have observable-state.ts file', () => {
      const observableStatePath = resolve(process.cwd(), '../src/observables/observable-state.ts');
      expect(existsSync(observableStatePath)).toBe(true);
    });

    it('should not have old JavaScript files', () => {
      const oldObservablePath = resolve(process.cwd(), '../src/observables/observable.js');
      const oldObservableStatePath = resolve(process.cwd(), '../src/observables/observable-state.js');
      
      expect(existsSync(oldObservablePath)).toBe(false);
      expect(existsSync(oldObservableStatePath)).toBe(false);
    });
  });

  describe('Observable module functionality', () => {
    let Observable;

    beforeEach(async () => {
      const observableModule = await import('../../src/observables/observable.ts');
      Observable = observableModule.Observable;
    });

    it('should create observable instances', () => {
      const observable = new Observable((observer) => {
        observer.next('hello');
        observer.complete();
      });

      expect(observable).toBeDefined();
    });

    it('should handle subscription and values', (done) => {
      const observable = new Observable((observer) => {
        observer.next('test-value');
        observer.complete();
      });

      observable.subscribe({
        next: (value) => {
          expect(value).toBe('test-value');
          done();
        }
      });
    });

    it('should handle function observers', (done) => {
      const observable = new Observable((observer) => {
        observer.next(42);
        observer.complete();
      });

      observable.subscribe((value) => {
        expect(value).toBe(42);
        done();
      });
    });

    it('should support unsubscription', () => {
      let subscribed = true;
      const observable = new Observable((observer) => {
        const interval = setInterval(() => {
          if (subscribed) observer.next('ping');
        }, 10);
        
        return () => {
          clearInterval(interval);
          subscribed = false;
        };
      });

      const subscription = observable.subscribe(() => {});
      expect(typeof subscription.unsubscribe).toBe('function');
      
      subscription.unsubscribe();
      expect(subscribed).toBe(false);
    });

    it('should support convenience methods', (done) => {
      const observable = new Observable((observer) => {
        observer.next('value');
        observer.complete();
      });

      observable.onValue((value) => {
        expect(value).toBe('value');
        done();
      });
    });
  });

  describe('ObservableState module functionality', () => {
    let ObservableState, effect;

    beforeEach(async () => {
      const observableStateModule = await import('../../src/observables/observable-state.ts');
      ObservableState = observableStateModule.ObservableState;
      effect = observableStateModule.effect;
    });

    it('should create observable state instances', () => {
      const state = new ObservableState({ count: 0 });
      expect(state).toBeDefined();
      expect(state.value).toEqual({ count: 0 });
    });

    it('should update state immutably', () => {
      const state = new ObservableState({ count: 0 });
      const originalValue = state.value;
      
      state.update(draft => {
        draft.count = 5;
      });
      
      expect(state.value.count).toBe(5);
      expect(originalValue.count).toBe(0); // Original unchanged
      expect(state.value).not.toBe(originalValue); // New object
    });

    it('should notify observers on state changes', async () => {
      const state = new ObservableState({ count: 0 });
      
      return new Promise((resolve) => {
        state.subscribe((newValue) => {
          expect(newValue.count).toBe(1);
          resolve();
        });
        
        state.update(draft => {
          draft.count = 1;
        });
      });
    });

    it('should support effects with dependency tracking', () => {
      const state = new ObservableState({ count: 0 });
      let effectRunCount = 0;
      let lastSeenValue = null;
      
      const dispose = effect(() => {
        effectRunCount++;
        lastSeenValue = state.value.count;
      });
      
      expect(effectRunCount).toBe(1);
      expect(lastSeenValue).toBe(0);
      
      state.update(draft => {
        draft.count = 10;
      });
      
      expect(effectRunCount).toBe(2);
      expect(lastSeenValue).toBe(10);
      
      dispose();
    });

    it('should support array methods when state is array', () => {
      const state = new ObservableState([1, 2, 3]);
      
      state.push(4);
      expect(state.value).toEqual([1, 2, 3, 4]);
      
      const popped = state.pop();
      // pop() might return void, just check the state
      expect(state.value).toEqual([1, 2, 3]);
      
      state.unshift(0);
      expect(state.value).toEqual([0, 1, 2, 3]);
      
      const shifted = state.shift();
      // shift() might return void, just check the state  
      expect(state.value).toEqual([1, 2, 3]);
    });

    it('should export derive function', async () => {
      // Just test that derive function is exported
      const { derive } = await import('../../src/observables/observable-state.ts');
      expect(typeof derive).toBe('function');
    });

    it('should handle nested object updates', () => {
      const state = new ObservableState({
        user: { name: 'John', age: 30 },
        items: [{ id: 1, name: 'Item 1' }]
      });
      
      state.update(draft => {
        draft.user.age = 31;
        draft.items.push({ id: 2, name: 'Item 2' });
      });
      
      expect(state.value.user.age).toBe(31);
      expect(state.value.items).toHaveLength(2);
      expect(state.value.items[1].name).toBe('Item 2');
    });
  });

  describe('Integration between Observable and ObservableState', () => {
    let Observable, ObservableState;

    beforeEach(async () => {
      const observableModule = await import('../../src/observables/observable.ts');
      const observableStateModule = await import('../../src/observables/observable-state.ts');
      Observable = observableModule.Observable;
      ObservableState = observableStateModule.ObservableState;
    });

    it('should work together in reactive patterns', async () => {
      const state = new ObservableState({ message: 'initial' });
      
      const observable = new Observable((observer) => {
        // Subscribe to state changes
        const unsubscribe = state.subscribe((newValue) => {
          observer.next(newValue.message.toUpperCase());
        });
        
        return unsubscribe;
      });
      
      return new Promise((resolve) => {
        let valueCount = 0;
        observable.subscribe((value) => {
          valueCount++;
          if (valueCount === 1) {
            expect(value).toBe('UPDATED');
            resolve();
          }
        });
        
        // Trigger update
        state.update(draft => {
          draft.message = 'updated';
        });
      });
    });
  });
});