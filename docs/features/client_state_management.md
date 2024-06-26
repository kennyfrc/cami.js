# Cross-Component Client State Management

In Cami, cross-component state management is achieved through the use of stores. A store is a reactive state container that components can connect to and interact with. By default, Cami's store uses localStorage to persist state with an expiry of 24 hours, ensuring that the state is maintained across browser sessions. This expiry is configurable by passing a configuration object with an `expiry` property to the store.

Here's an example of defining a store with a custom expiry and using it in two components:

```javascript
const CartStore = cami.store({
  cartItems: [],
}, {
  name: 'CartStore',
  expiry: 1000 * 60 * 60 * 24 * 3 // 3 days
});

// Register actions for adding and removing items
CartStore.register('add', (state, payload) => {
  const newItem = {...payload, id: Date.now()}; // Generate a unique id
  state.cartItems.push(newItem);
});

CartStore.register('remove', (state, payload) => {
  state.cartItems = state.cartItems.filter(item => item.id !== payload.id);
});

class ProductListElement extends ReactiveElement {
  cartItems = [];
  products = [];

  onConnect() {
    CartStore.subscribe(state => {
      this.cartItems = state.cartItems;
    });
    this.products = this.query({
      queryKey: ['products'],
      queryFn: () => {
        return fetch("https://api.camijs.com/products?_limit=3").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });
    // ...
  }

  // ...
}

// Define a component for the cart
class CartElement extends ReactiveElement {
  cartItems = [];

  onConnect() {
    CartStore.subscribe(state => {
      this.cartItems = state.cartItems;
    });
  }
  // ...
}
```

Above, both `ProductListElement` and `CartElement` subscribe to `CartStore`. When a product is added or removed in `ProductListElement`, the changes are reflected in `CartElement` because they both share the same state from `CartStore`. The store's expiry is set to 24 hours, after which the state will no longer be persisted.

The `ProductListElement` is initialized with a `query` that fetches product data from an API. This data is used to populate the `products` property. The `query` is configured with a `staleTime` of 5 minutes, indicating that the fetched data will be considered fresh for this duration before a new fetch is triggered.

The `ProductListElement` also includes methods to add products to the cart, check if a product is already in the cart, and determine if a product is out of stock. The `template` method defines the HTML structure for the component, including a loading state, error handling, and the list of products with an "Add to cart" button that is disabled if the product is out of stock.

Here is the relevant code for `ProductListElement`:
```javascript
// Define a component for listing products
class ProductListElement extends ReactiveElement {
  cartItems = [];
  products = [];

  onConnect() {
    CartStore.subscribe(state => {
      this.cartItems = state.cartItems;
    });
    this.products = this.query({
      queryKey: ['products'],
      queryFn: () => {
        return fetch("https://api.camijs.com/products?_limit=3").then(res => res.json());
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });
  }

  isProductInCart(product) {
    return this.cartItems ? this.cartItems.some(item => item.id === product.id) : false;
  }

  isOutOfStock(product) {
    return product.stock === 0;
  }

  template() {
    if (this.products.status === "pending") {
      return html`<div>Loading...</div>`;
    }

    if (this.products.status === "error") {
      return html`<div>Error: ${this.products.errorDetails.message}</div>`;
    }

    if (this.products && this.products.data) {
      return html`
        <ul>
          ${this.products.data.map(product => html`<li>
            ${product.name} - ${(product.price / 100).toFixed(2)}
            <button @click=${() => CartStore.dispatch('add', product)} ?disabled=${this.isOutOfStock(product)}>
              Add to cart
            </button>
          </li>`)}
        </ul>
      `;
    }
  }
}

customElements.define('product-list-component', ProductListElement);
```

This example demonstrates how `ProductListElement` interacts with `CartStore` and manages its own local state and UI rendering logic.

Lastly, we then add the cart component to the page:

The way this works is that `CartElement` extends `ReactiveElement` to create a reactive cart component. It connects to `CartStore` to listen for changes in the cart items and defines a getter `cartValue` to calculate the total value of the cart. It also includes a method `removeFromCart` to handle the removal of items from the cart. The `template` method returns the HTML structure for the cart, including the total cart value and a list of items with remove buttons.

```javascript
// Define a component for the cart
class CartElement extends ReactiveElement {
  cartItems = [];

  onConnect() {
    CartStore.subscribe(state => {
      this.cartItems = state.cartItems;
    });
  }

  template() {
    return html`
      ${this.cartItems.length > 0 ? html`
        <p>Cart value: ${(this.cartItems.reduce((acc, item) => acc + item.price, 0) / 100).toFixed(2)}</p>
        <ul>
          ${this.cartItems.map(item => html`
            <li>${item.name} - ${(item.price / 100).toFixed(2)} <button @click=${() => CartStore.dispatch('remove', item)}>Remove</button></li>
          `)}
        </ul>
      ` : html`
        <p>Cart is empty</p>
      `}
    `;
  }
}

customElements.define('cart-component', CartElement);
```

Below is the live demo.

<hr>

### Live Demo - Cross-Component State Management

  <article>
  <h4>Products</h4>
  <p>This fetches the products from an API, and uses a client-side store to manage the cart. After adding a product to the cart, you can refresh the page and the cart will still be there as we are persisting the cart to localStorage, which is what you want in a cart.</p>

<iframe width="100%" height="300" src="//jsfiddle.net/kennyfrc12/qjs8c2gb/27/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
