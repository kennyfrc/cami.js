const { ObservableStore, store } = cami;

describe("ObservableStore", function() {
  describe("Cami Store without Local Storage", function() {
    let store;

    beforeEach(function() {
      store = new ObservableStore({ count: 0 });
    });

    it("should initialize with the given initial state", function() {
      expect(store.state.count).toBe(0);
    });

    it("should allow action registration and handle dispatch", function() {
      store.register('increment', (state) => {
        state.count += 1;
      });
      store.dispatch('increment');
      expect(store.state.count).toBe(1);
    });

    it("should apply middleware to dispatched actions", function() {
      const middlewareSpy = jasmine.createSpy('middleware');
      store.use(middlewareSpy);
      store.register('increment', (state) => {
        state.count += 1;
      });
      store.dispatch('increment');
      expect(middlewareSpy).toHaveBeenCalled();
    });

    it("should handle multiple actions and their interactions", function() {
      store.register('increment', (state) => {
        state.count += 1;
      });
      store.register('decrement', (state) => {
        state.count -= 1;
      });
      store.dispatch('increment');
      store.dispatch('increment');
      store.dispatch('decrement');
      expect(store.state.count).toBe(1);
    });

    it("should handle nested state updates", function() {
      store.register('addNested', (state) => {
        if (!state.nested) {
          state.nested = { count: 0 };
        }
        state.nested.count += 1;
      });
      store.dispatch('addNested');
      expect(store.state.nested.count).toBe(1);
    });
  });

  describe("Cami Store with Local Storage", function() {
    let store;
    const initialState = {
      items: [],
      add: (store, item) => {
        store.items.push(item);
      }
    };

    const options = { name: 'test-store', expiry: 1000, localStorage: true };

    beforeEach(function() {
      spyOn(localStorage, 'getItem').and.callFake((key) => {
        const store = {
          'test-store': JSON.stringify(initialState),
          'test-store-expiry': (new Date().getTime() + options.expiry).toString()
        };
        return store[key] || null;
      });
      spyOn(localStorage, 'setItem');
      spyOn(localStorage, 'removeItem');

      store = cami.store(initialState, options);
    });

    it("should rehydrate state from local storage", function() {
      expect(store.state.items).toEqual([]);
    });

    it("should persist state to local storage on update", function() {
      store.register('addItem', (state, item) => {
        state.items.push(item);
      });
      store.dispatch('addItem', 'test item');
      expect(localStorage.setItem).toHaveBeenCalledWith('test-store', jasmine.any(String));
    });

    it("should persist state to local storage on update without using register/dispatch", function() {
      store.add({ item: 'test item' });
      expect(localStorage.setItem).toHaveBeenCalledWith('test-store', jasmine.any(String));
    });

    it("should reset state and clear local storage", function() {
      store.reset();
      expect(localStorage.removeItem).toHaveBeenCalledWith('test-store');
      expect(localStorage.removeItem).toHaveBeenCalledWith('test-store-expiry');
      expect(store.state.items).toEqual([]);
    });

    it("should handle state expiry correctly", function(done) {
      const expiredState = {
        'test-store': JSON.stringify({ items: ['expired item'] }),
        'test-store-expiry': (new Date().getTime() - 1000).toString()
      };
      localStorage.getItem.and.callFake((key) => expiredState[key] || null);

      store = cami.store(initialState, options);
      setTimeout(() => {
        expect(store.state.items).toEqual([]);
        done();
      }, 50);
    });

    it("should handle nested state updates and persist them", function() {
      store.register('addNestedItem', (state, item) => {
        if (!state.nested) {
          state.nested = { items: [] };
        }
        state.nested.items.push(item);
      });
      store.dispatch('addNestedItem', 'nested item');
      expect(store.state.nested.items).toEqual(['nested item']);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-store', jasmine.any(String));
    });
  });
});
