const { store, slice } = cami;

describe("Slice functionality", function() {
  let appStore;
  let cartSlice;

  beforeEach(() => {
    appStore = store({}, { name: 'AppStore' });
    cartSlice = slice(appStore, {
      name: 'cart',
      state: {
        cartItems: [],
      },
      actions: {
        add({ state, payload }) { // Updated parameter format
          const newItem = { ...payload, id: Date.now() + Math.random() };
          state.cartItems.push(newItem);
        },
        remove({ state, payload }) { // Updated parameter format
          state.cartItems = state.cartItems.filter(item => item.id !== payload.id);
        },
        reset({ state }) { // Updated parameter format
          state.cartItems = [];
        }
      }
    });
    cartSlice.actions.reset(); // Reset state before each test
  });

  it("should initialize with the correct initial state", function() {
    expect(cartSlice.getState().cartItems).toEqual([]);
  });

  it("should handle actions correctly", function() {
    cartSlice.actions.add({ name: 'Product 1', price: 100 });
    expect(cartSlice.getState().cartItems.length).toBe(1);
    expect(cartSlice.getState().cartItems[0].name).toBe('Product 1');

    cartSlice.actions.remove({ id: cartSlice.getState().cartItems[0].id });
    expect(cartSlice.getState().cartItems.length).toBe(0);
  });

  it("should reflect changes in the main store", function() {
    cartSlice.actions.add({ name: 'Product 2', price: 200 });
    expect(appStore.getState().cart.cartItems[0].name).toBe('Product 2');
  });

  it("should handle multiple add and remove actions", function() {
    cartSlice.actions.add({ name: 'Product 3', price: 300 });
    cartSlice.actions.add({ name: 'Product 4', price: 400 });
    expect(cartSlice.getState().cartItems.length).toBe(2);
    expect(cartSlice.getState().cartItems[1].name).toBe('Product 4');

    cartSlice.actions.remove({ id: cartSlice.getState().cartItems[0].id });
    expect(cartSlice.getState().cartItems.length).toBe(1);
    expect(cartSlice.getState().cartItems[0].name).toBe('Product 4');
  });

  it("should not remove an item that doesn't exist", function() {
    cartSlice.actions.add({ name: 'Product 5', price: 500 });
    const nonExistentId = Date.now() + 1;
    cartSlice.actions.remove({ id: nonExistentId });
    expect(cartSlice.getState().cartItems.length).toBe(1);
    expect(cartSlice.getState().cartItems[0].name).toBe('Product 5');
  });

  it("should handle edge cases gracefully", function() {
    cartSlice.actions.add({ name: 'Product 6' });
    expect(cartSlice.getState().cartItems.length).toBe(1);
    expect(cartSlice.getState().cartItems[0].name).toBe('Product 6');
    expect(cartSlice.getState().cartItems[0].price).toBeUndefined();

    cartSlice.actions.add({});
    expect(cartSlice.getState().cartItems.length).toBe(2);
    expect(cartSlice.getState().cartItems[1].name).toBeUndefined();
    expect(cartSlice.getState().cartItems[1].price).toBeUndefined();
  });
});
