const { model } = cami;

describe("Observable Model", function() {
  describe("Basic Functionality", function() {
    let createModel;

    beforeEach(function() {
      createModel = (uniqueName) => model({
        name: uniqueName,
        state: { items: [], total: 0 },
        actions: {
          addItem: ({ state, payload }) => {
            state.items.push(payload);
            state.total += payload.price;
          },
          removeItem: ({ state, payload: id }) => {
            const item = state.items.find(item => item.id === id);
            if (item) {
              state.items = state.items.filter(item => item.id !== id);
              state.total -= item.price;
            }
          }
        },
        asyncActions: {
          fetchItems: async ({ dispatch }) => {
            const items = await Promise.resolve([{ id: 1, name: 'Test Item', price: 10 }]);
            dispatch(`${uniqueName}/setItems`, items);
          }
        },
        memos: {
          itemCount: ({ state }) => state.items.length
        },
        options: {
          adapter: 'memory'
        }
      });
    });

    it("should initialize with the given initial state", function() {
      const cartModel = createModel('cart1');
      expect(cartModel.items).toEqual([]);
      expect(cartModel.total).toBe(0);
    });

    it("should handle namespaced action dispatch", function() {
      const cartModel = createModel('cart2');
      cartModel.dispatch('cart2/addItem', { id: 1, name: 'Test Item', price: 10 });
      expect(cartModel.items.length).toBe(1);
      expect(cartModel.total).toBe(10);
    });

    it("should handle multiple namespaced actions", function() {
      const cartModel = createModel('cart3');
      cartModel.dispatch('cart3/addItem', { id: 1, name: 'Item 1', price: 10 });
      cartModel.dispatch('cart3/addItem', { id: 2, name: 'Item 2', price: 20 });
      expect(cartModel.items.length).toBe(2);
      expect(cartModel.total).toBe(30);
      cartModel.dispatch('cart3/removeItem', 1);
      expect(cartModel.items.length).toBe(1);
      expect(cartModel.total).toBe(20);
    });

    it("should handle async actions", async function() {
      const cartModel = createModel('cart4');
      cartModel.defineAction('cart4/setItems', ({ state, payload }) => {
        state.items = payload;
        state.total = payload.reduce((sum, item) => sum + item.price, 0);
      });
      await cartModel.dispatchAsync('cart4/fetchItems');
      expect(cartModel.items.length).toBe(1);
      expect(cartModel.total).toBe(10);
    });

    it("should compute memos correctly", function() {
      const cartModel = createModel('cart5');
      cartModel.dispatch('cart5/addItem', { id: 1, name: 'Item 1', price: 10 });
      cartModel.dispatch('cart5/addItem', { id: 2, name: 'Item 2', price: 20 });
      expect(cartModel.memo('cart5/itemCount')).toBe(2);
    });
  });

  describe("Complex Model Interactions", function() {
    let createCartModel, createUserModel;

    beforeEach(function() {
      createCartModel = (uniqueName) => model({
        name: uniqueName,
        state: { items: [], total: 0 },
        actions: {
          addItem: ({ state, payload }) => {
            state.items.push(payload);
            state.total += payload.price;
          }
        },
        options: { adapter: 'memory' }
      });

      createUserModel = (uniqueName) => model({
        name: uniqueName,
        state: { id: null, name: '', cart: null },
        actions: {
          setUser: ({ state, payload }) => {
            state.id = payload.id;
            state.name = payload.name;
          },
          assignCart: ({ state, payload: cartId }) => {
            state.cart = cartId;
          }
        },
        options: { adapter: 'memory' }
      });
    });

    it("should allow interaction between models", function() {
      const cartModel = createCartModel('cart6');
      const userModel = createUserModel('user1');

      userModel.dispatch('user1/setUser', { id: 1, name: 'John Doe' });
      cartModel.dispatch('cart6/addItem', { id: 1, name: 'Item 1', price: 10 });
      userModel.dispatch('user1/assignCart', 'cart6');

      expect(userModel.id).toBe(1);
      expect(userModel.name).toBe('John Doe');
      expect(userModel.cart).toBe('cart6');
      expect(cartModel.items.length).toBe(1);
      expect(cartModel.total).toBe(10);
    });

    it("should maintain separate states for different models", function() {
      const cartModel = createCartModel('cart7');
      const userModel = createUserModel('user2');

      userModel.dispatch('user2/setUser', { id: 1, name: 'John Doe' });
      cartModel.dispatch('cart7/addItem', { id: 1, name: 'Item 1', price: 10 });

      expect(userModel.state).toEqual({ id: 1, name: 'John Doe', cart: null });
      expect(cartModel.state).toEqual({ items: [{ id: 1, name: 'Item 1', price: 10 }], total: 10 });
    });
  });
});
