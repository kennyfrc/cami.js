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
        add(state, payload) {
          console.log(`state: ${JSON.stringify(state)}`);
          const newItem = { ...payload, id: Date.now() + Math.random() }; // some bs random number for id
          state.cartItems.push(newItem);
          console.log('State after add:', state.cartItems);
        },
        remove(state, payload) {
          console.log(`state: ${state}`);
          const filteredItems = state.cartItems.filter(item => item.id !== payload.id);
          state.cartItems = filteredItems;
          console.log('State after remove:', state.cartItems);
        }
      }
    });
  });

  it("should initialize with the correct initial state", function() {
    expect(cartSlice.getState().cartItems).toEqual([]);
  });

  it("should handle actions correctly", function() {
    cartSlice.actions.add({ name: 'Product 1', price: 100 });
    console.log('After add action:', cartSlice.getState().cartItems);
    expect(cartSlice.getState().cartItems.length).toBe(1);
    expect(cartSlice.getState().cartItems[0].name).toBe('Product 1');

    cartSlice.actions.remove({ id: cartSlice.getState().cartItems[0].id });
    console.log('After remove action:', cartSlice.getState().cartItems);
    expect(appStore.state.cart.cartItems.length).toBe(0);
  });

  it("should reflect changes in the main store", function() {
    cartSlice.actions.add({ name: 'Product 2', price: 200 });
    console.log('Main store state:', appStore.getState().cart.cartItems);
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
    cartSlice.actions.add({ name: 'Product 6' }); // Missing price
    expect(cartSlice.getState().cartItems.length).toBe(1);
    expect(cartSlice.getState().cartItems[0].name).toBe('Product 6');
    expect(cartSlice.getState().cartItems[0].price).toBeUndefined();

    cartSlice.actions.add({}); // Missing name and price
    expect(cartSlice.getState().cartItems.length).toBe(2);
    expect(cartSlice.getState().cartItems[1].name).toBeUndefined();
    expect(cartSlice.getState().cartItems[1].price).toBeUndefined();
  });
});
