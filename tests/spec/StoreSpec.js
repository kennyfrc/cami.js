const { store } = cami;

describe("Observable Store (Set 1)", function() {
  describe("Basic Functionality", function() {
    let createStore;
    let appStore;

    beforeEach(function() {
      createStore = () => store({
        state: { count: 0, nested: { value: 10 }, list: [] },
        name: `test-store-${Date.now()}`,
        localStorage: false
      });
    });

    afterEach(function() {
      // Null the appStore and reset it after each test
      appStore = null;
      createStore = null;
    });

    it("should initialize with the given initial state", function() {
      appStore = createStore();
      expect(appStore.count).toBe(0);
      expect(appStore.nested.value).toBe(10);
      expect(appStore.list).toEqual([]);
    });

    it("should allow action registration and handle dispatch", function() {
      appStore = createStore();
      appStore.defineAction('increment', ({ state, payload }) => {
        state.count += payload || 1;
      });
      appStore.dispatch('increment');
      expect(appStore.count).toBe(1);
      appStore.dispatch('increment', 5);
      expect(appStore.count).toBe(6);
    });

    it("should handle multiple actions and their interactions", function() {
      appStore = createStore();
      appStore.defineAction('increment', ({ state }) => {
        state.count += 1;
      });
      appStore.defineAction('decrement', ({ state }) => {
        state.count -= 1;
      });
      appStore.defineAction('reset', ({ state }) => {
        state.count = 0;
      });

      appStore.dispatch('increment');
      appStore.dispatch('increment');
      expect(appStore.count).toBe(2);
      appStore.dispatch('decrement');
      expect(appStore.count).toBe(1);
      appStore.dispatch('reset');
      expect(appStore.count).toBe(0);
    });

    it("should handle nested state updates", function() {
      appStore = createStore();
      appStore.defineAction('updateNested', ({ state, payload }) => {
        state.nested.value = payload;
      });
      appStore.dispatch('updateNested', 20);
      expect(appStore.nested.value).toBe(20);
    });

    it("should handle array operations", function() {
      appStore = createStore();
      appStore.defineAction('addItem', ({ state, payload }) => {
        state.list.push(payload);
      });
      appStore.defineAction('removeItem', ({ state, payload }) => {
        const index = state.list.indexOf(payload);
        if (index > -1) {
          state.list.splice(index, 1);
        }
      });

      appStore.dispatch('addItem', 'item1');
      appStore.dispatch('addItem', 'item2');
      expect(appStore.list).toEqual(['item1', 'item2']);
      appStore.dispatch('removeItem', 'item1');
      expect(appStore.list).toEqual(['item2']);
    });

    it("should apply middleware to dispatched actions", async function() {
      appStore = createStore();
      const middlewareSpy = jasmine.createSpy('middleware').and.callFake(async (next) => {
        await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async operation
      });
      appStore.use(middlewareSpy);
      appStore.defineAction('incrementWithMiddleware', ({ state }) => {
        state.count += 1;
      });
      await appStore.dispatch('incrementWithMiddleware');
      expect(middlewareSpy).toHaveBeenCalled();
      expect(appStore.count).toBe(1);
    });

    describe("Complex State Transformations", function() {
      let appStore;

      beforeEach(function() {
        appStore = createStore();
        appStore.defineAction('complexUpdate', ({ state, payload }) => {
          state.count *= 2;
          state.nested.value += payload;
          state.list = state.list.concat([state.count, state.nested.value]);
        });
      });

      it("should handle the first complex state transformation", function() {
        appStore.dispatch('complexUpdate', 5);
        expect(appStore.count).toBe(0);
        expect(appStore.nested.value).toBe(15);
        expect(appStore.list).toEqual([0, 15]);
      });

      it("should handle the second complex state transformation", function() {
        // First dispatch to set up the initial state
        appStore.dispatch('complexUpdate', 5);

        // The actual test dispatch
        appStore.dispatch('complexUpdate', 10);
        expect(appStore.count).toBe(0);
        expect(appStore.nested.value).toBe(25);
        expect(appStore.list).toEqual([0, 15, 0, 25]);
      });
});
  });
});
