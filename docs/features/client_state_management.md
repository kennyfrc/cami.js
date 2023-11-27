# Cross-Component State Management - WIP

In Cami.js, cross-component state management is achieved through the use of stores. A store is a reactive state container that components can connect to and interact with. This allows for state to be shared across multiple components, and for changes in the state to automatically reflect in all connected components.

Here's an example of defining a store and using it in two components:

```javascript
const CartStore = cami.store({
  cartItems: [],
  add: (store, product) => {
    const cartItem = { ...product, cartItemId: Date.now() };
    store.cartItems.push(cartItem);
  },
  remove: (store, product) => {
    store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
  }
});

class ProductListElement extends ReactiveElement {
  cartItems = this.connect(CartStore, 'cartItems');
  // ...
}

class CartElement extends ReactiveElement {
  cartItems = this.connect(CartStore, 'cartItems');
  // ...
}
```

In this example, both `ProductListElement` and `CartElement` connect to `CartStore`. When a product is added or removed in `ProductListElement`, the changes are reflected in `CartElement` because they both share the same state from `CartStore`.

This makes it easy to manage and share state across multiple components, and ensures that the UI is always in sync with the state.
