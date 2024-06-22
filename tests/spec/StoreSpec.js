const { store } = cami;

describe("Cami Store", function() {
  describe("Basic Functionality", function() {
    let createStore;

    beforeEach(function() {
      createStore = () => store({
        state: { count: 0, nested: { value: 10 }, list: [] },
        name: `test-store-${Date.now()}`,
        localStorage: false
      });
    });

    it("should initialize with the given initial state", function() {
      const appStore = createStore();
      expect(appStore.count).toBe(0);
      expect(appStore.nested.value).toBe(10);
      expect(appStore.list).toEqual([]);
    });

    it("should allow action registration and handle dispatch", function() {
      const appStore = createStore();
      appStore.action('increment', ({ state, payload }) => {
        state.count += payload || 1;
      });
      appStore.dispatch('increment');
      expect(appStore.count).toBe(1);
      appStore.dispatch('increment', 5);
      expect(appStore.count).toBe(6);
    });

    it("should handle multiple actions and their interactions", function() {
      const appStore = createStore();
      appStore.action('increment', ({ state }) => {
        state.count += 1;
      });
      appStore.action('decrement', ({ state }) => {
        state.count -= 1;
      });
      appStore.action('reset', ({ state }) => {
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
      const appStore = createStore();
      appStore.action('updateNested', ({ state, payload }) => {
        state.nested.value = payload;
      });
      appStore.dispatch('updateNested', 20);
      expect(appStore.nested.value).toBe(20);
    });

    it("should handle array operations", function() {
      const appStore = createStore();
      appStore.action('addItem', ({ state, payload }) => {
        state.list.push(payload);
      });
      appStore.action('removeItem', ({ state, payload }) => {
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
      const appStore = createStore();
      const middlewareSpy = jasmine.createSpy('middleware').and.callFake(async (next) => {
        await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async operation
      });
      appStore.use(middlewareSpy);
      appStore.action('incrementWithMiddleware', ({ state }) => {
        state.count += 1;
      });
      await appStore.dispatch('incrementWithMiddleware');
      expect(middlewareSpy).toHaveBeenCalled();
      expect(appStore.count).toBe(1);
    });

    it("should handle complex state transformations", function() {
      const appStore = createStore();
      appStore.action('complexUpdate', ({ state, payload }) => {
        state.count *= 2;
        state.nested.value += payload;
        state.list = state.list.concat([state.count, state.nested.value]);
      });

      appStore.dispatch('complexUpdate', 5);
      expect(appStore.count).toBe(0);
      expect(appStore.nested.value).toBe(15);
      expect(appStore.list).toEqual([0, 15]);

      appStore.dispatch('complexUpdate', 10);
      expect(appStore.count).toBe(0);
      expect(appStore.nested.value).toBe(25);
      expect(appStore.list).toEqual([0, 15, 0, 25]);
    });
  });
});
