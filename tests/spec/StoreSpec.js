import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';

const { store } = cami;

describe("Observable Store (Set 1)", function () {
  describe("Basic Functionality", function () {
    let createStore;
    let appStore;

    beforeEach(function () {
      createStore = () =>
        store({
          state: { count: 0, nested: { value: 10 }, list: [] },
          name: `test-store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          localStorage: false,
        });
    });

    afterEach(function () {
      // Null the appStore and reset it after each test
      appStore = null;
      createStore = null;
    });

    it("should initialize with the given initial state", function () {
      appStore = createStore();
      expect(appStore.getState().count).toBe(0);
      expect(appStore.getState().nested.value).toBe(10);
      expect(appStore.getState().list).toEqual([]);
    });

    it("should allow action registration and handle dispatch", function () {
      appStore = createStore();
      appStore.defineAction("increment", ({ state, payload }) => {
        state.count += payload || 1;
      });
      appStore.dispatch("increment");
      expect(appStore.getState().count).toBe(1);
      appStore.dispatch("increment", 5);
      expect(appStore.getState().count).toBe(6);
    });

    it("should handle multiple actions and their interactions", function () {
      appStore = createStore();
      appStore.defineAction("increment", ({ state }) => {
        state.count += 1;
      });
      appStore.defineAction("decrement", ({ state }) => {
        state.count -= 1;
      });
      appStore.defineAction("reset", ({ state }) => {
        state.count = 0;
      });

      appStore.dispatch("increment");
      appStore.dispatch("increment");
      expect(appStore.getState().count).toBe(2);
      appStore.dispatch("decrement");
      expect(appStore.getState().count).toBe(1);
      appStore.dispatch("reset");
      expect(appStore.getState().count).toBe(0);
    });

    it("should handle nested state updates", function () {
      appStore = createStore();
      appStore.defineAction("updateNested", ({ state, payload }) => {
        state.nested.value = payload;
      });
      appStore.dispatch("updateNested", 20);
      expect(appStore.getState().nested.value).toBe(20);
    });

    it("should handle array operations", function () {
      appStore = createStore();
      appStore.defineAction("addItem", ({ state, payload }) => {
        state.list.push(payload);
      });
      appStore.defineAction("removeItem", ({ state, payload }) => {
        const index = state.list.indexOf(payload);
        if (index > -1) {
          state.list.splice(index, 1);
        }
      });

      appStore.dispatch("addItem", "item1");
      appStore.dispatch("addItem", "item2");
      expect(appStore.getState().list).toEqual(["item1", "item2"]);
      appStore.dispatch("removeItem", "item1");
      expect(appStore.getState().list).toEqual(["item2"]);
    });

    describe("Complex State Transformations", function () {
      it("should handle the first complex state transformation", function () {
        appStore = createStore();
        appStore.defineAction("complexUpdate", ({ state, payload }) => {
          state.count *= 2;
          state.nested.value += payload;
          state.list = state.list.concat([state.count, state.nested.value]);
        });
        
        appStore.dispatch("complexUpdate", 5);
        expect(appStore.getState().count).toBe(0);
        expect(appStore.getState().nested.value).toBe(15);
        expect(appStore.getState().list).toEqual([0, 15]);
      });

      it("should handle the second complex state transformation", function () {
        appStore = createStore();
        appStore.defineAction("complexUpdate", ({ state, payload }) => {
          state.count *= 2;
          state.nested.value += payload;
          state.list = state.list.concat([state.count, state.nested.value]);
        });
        
        // First dispatch to set up the initial state
        appStore.dispatch("complexUpdate", 5);

        // The actual test dispatch
        appStore.dispatch("complexUpdate", 10);
        expect(appStore.getState().count).toBe(0);
        expect(appStore.getState().nested.value).toBe(25);
        expect(appStore.getState().list).toEqual([0, 15, 0, 25]);
      });
    });
  });

  describe("Rollback Functionality", function () {
    let appStore;
    let createStore;

    beforeEach(function () {
      createStore = () =>
        store({
          state: { count: 0, nested: { value: 10 }, list: [] },
          name: `test-store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          localStorage: false,
        });
      appStore = createStore();
      appStore.defineAction("updateMultipleFields", ({ state, payload }) => {
        state.count += payload.countIncrement;
        state.nested.value += payload.nestedIncrement;
        if (payload.shouldThrow) {
          throw new Error("Action failed");
        }
        state.list.push(payload.newItem);
      });
    });

    afterEach(function () {
      // Ensure proper cleanup
      appStore = null;
      createStore = null;
    });

    it("should rollback state changes when an action throws an error", function () {
      const initialState = JSON.parse(JSON.stringify(appStore.getState()));

      expect(() => {
        appStore.dispatch("updateMultipleFields", {
          countIncrement: 5,
          nestedIncrement: 10,
          newItem: "test",
          shouldThrow: true,
        });
      }).toThrow("Action failed");

      expect(appStore.getState()).toEqual(initialState);
    });

    it("should maintain state consistency across multiple dispatches when an error occurs", function () {
      appStore.dispatch("updateMultipleFields", {
        countIncrement: 3,
        nestedIncrement: 5,
        newItem: "item1",
        shouldThrow: false,
      });

      const intermediateState = JSON.parse(JSON.stringify(appStore.getState()));

      expect(() => {
        appStore.dispatch("updateMultipleFields", {
          countIncrement: 2,
          nestedIncrement: 7,
          newItem: "item2",
          shouldThrow: true,
        });
      }).toThrow("Action failed");

      expect(appStore.getState()).toEqual(intermediateState);
    });

    it("should handle nested action calls and rollback correctly", function () {
      appStore.defineAction("nestedAction", ({ state, dispatch }) => {
        state.count += 1;
        dispatch("updateMultipleFields", {
          countIncrement: 1,
          nestedIncrement: 1,
          newItem: "nested",
          shouldThrow: true,
        });
      });

      const initialState = JSON.parse(JSON.stringify(appStore.getState()));

      expect(() => {
        appStore.dispatch("nestedAction");
      }).toThrow("Action failed");

      expect(appStore.getState()).toEqual(initialState);
    });
  });
});