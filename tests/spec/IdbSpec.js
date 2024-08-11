const { store, indexedDBMiddleware } = cami;

describe("IndexedDB Middleware", function() {
  let appStore;
  let createStore;

  beforeEach(function(done) {
    createStore = async () => {
      const newStore = store({
        state: { count: 0, nested: { value: 10 }, list: [] },
        name: `test-idb-store-${Date.now()}`,
        middleware: [indexedDBMiddleware({ name: 'test-idb-store' })]
      });
      await newStore.loadInitialState();
      return newStore;
    };
    createStore().then(store => {
      appStore = store;
      done();
    });
  });

  it("should persist state changes to IndexedDB", async function() {
    appStore.defineAction('increment', ({ state, payload }) => {
      state.count += payload || 1;
    });

    await appStore.dispatch('increment', 5);
    expect(appStore.state.count).toBe(5);

    // Create a new store instance to test persistence
    const newStore = await createStore();
    await newStore.loadInitialState();

    expect(newStore.state.count).toBe(5);
  });

  it("should handle complex state updates in IndexedDB", async function() {
    appStore.defineAction('complexUpdate', ({ state, payload }) => {
      state.count *= 2;
      state.nested.value += payload;
      state.list = state.list.concat([state.count, state.nested.value]);
    });

    await appStore.dispatch('complexUpdate', 5);
    expect(appStore.state.count).toBe(0);
    expect(appStore.state.nested.value).toBe(15);
    expect(appStore.state.list).toEqual([0, 15]);

    // Create a new store instance to test persistence
    const newStore = await createStore();
    await newStore.loadInitialState();

    expect(newStore.state.count).toBe(0);
    expect(newStore.state.nested.value).toBe(15);
    expect(newStore.state.list).toEqual([0, 15]);
  });

  it("should maintain state consistency across multiple dispatches", async function() {
    appStore.defineAction('updateMultipleFields', ({ state, payload }) => {
      state.count += payload.countIncrement;
      state.nested.value += payload.nestedIncrement;
      state.list.push(payload.newItem);
    });

    await appStore.dispatch('updateMultipleFields', {
      countIncrement: 3,
      nestedIncrement: 5,
      newItem: 'item1'
    });

    await appStore.dispatch('updateMultipleFields', {
      countIncrement: 2,
      nestedIncrement: 7,
      newItem: 'item2'
    });

    // Create a new store instance to test persistence
    const newStore = await createStore();
    await newStore.loadInitialState();

    expect(newStore.state.count).toBe(5);
    expect(newStore.state.nested.value).toBe(22);
    expect(newStore.state.list).toEqual(['item1', 'item2']);
  });

  it("should handle rollback functionality with IndexedDB", async function() {
    appStore.defineAction('updateWithPossibleError', ({ state, payload }) => {
      state.count += payload.increment;
      if (payload.shouldThrow) {
        throw new Error("Action failed");
      }
      state.list.push(payload.newItem);
    });

    await appStore.dispatch('updateWithPossibleError', {
      increment: 5,
      newItem: 'success',
      shouldThrow: false
    });

    await expect(appStore.dispatch('updateWithPossibleError', {
      increment: 10,
      newItem: 'failure',
      shouldThrow: true
    })).rejects.toThrow("Action failed");

    // Create a new store instance to test persistence
    const newStore = await createStore();
    await newStore.loadInitialState();

    expect(newStore.state.count).toBe(5);
    expect(newStore.state.list).toEqual(['success']);
  });
});
