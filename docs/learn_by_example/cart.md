# Shopping Cart with Server & Client State

<article>
  <h4>Products</h4>
  <p>This fetches the products from an API, and uses a client-side store to manage the cart. After adding a product to the cart, you can refresh the page and the cart will still be there as we are persisting the cart to localStorage, which is what you want in a cart.</p>
  <h5>Product List</h5>
  <product-list-cami-example-be></product-list-cami-example-be>
</article>
<article>
  <h4>Cart</h4>
  <cart-cami-example></cart-cami-example>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  const CartStore = cami.store({
    cartItems: [],
    add: (store, product) => {
      const cartItem = { ...product, cartItemId: Date.now() };
      store.cartItems.push(cartItem);
    },
    remove: (store, product) => {
      store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
    }
  }, {name: 'CartStore', expiry: 1000 * 60 * 60 * 24 * 3}); // 3 days
  // CartStore.reset() // if for some reason, you want to reset the store

  // Define a middleware function
  const loggerMiddleware = (context) => {
    console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
  };

  // Use the middleware function with the initialState
  CartStore.use(loggerMiddleware);

  class ProductListElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');
    products = this.query({
      queryKey: ['products'],
      queryFn: () => {
        return fetch("https://api.camijs.com/products?_limit=3").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });

    addToCart(product) {
      CartStore.add(product);
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
        return html`<div>Error: ${this.products.error.message}</div>`;
      }

      if (this.products.data) {
        return html`
          <ul>
            ${this.products.data.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button class="md-button md-small" @click=${() => this.addToCart(product)} ?disabled=${this.isOutOfStock(product)}>
                  Add to cart
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }
  }

  customElements.define('product-list-cami-example-be', ProductListElement);

  class CartElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');

    get cartValue() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    }

    removeFromCart(product) {
      CartStore.remove(product);
    }

    template() {
      return html`
        <p>Note: Refresh the page to see that the cart is persisted to localStorage. You can also look at <code>Chrome DevTools > Application > Local Storage</code> to see the cart items.</p>
        <p>Cart value: $${(this.cartValue / 100).toFixed(2)}</p>
        <ul>
          ${this.cartItems.map(item => html`
            <li>${item.name} - $${(item.price / 100).toFixed(2)} <button class="md-button md-small" @click=${() => this.removeFromCart(item)}>Remove</button></li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('cart-cami-example', CartElement);
</script>


HTML:

```html
<article>
  <h4>Products</h4>
  <p>This fetches the products from an API, and uses a client-side store to manage the cart. After adding a product to the cart, you can refresh the page and the cart will still be there as we are persisting the cart to localStorage, which is what you want in a cart.</p>
  <h5>Product List</h5>
  <product-list-cami-example-be></product-list-cami-example-be>
</article>
<article>
  <h4>Cart</h4>
  <cart-cami-example></cart-cami-example>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  const CartStore = cami.store({
    cartItems: [],
    add: (store, product) => {
      const cartItem = { ...product, cartItemId: Date.now() };
      store.cartItems.push(cartItem);
    },
    remove: (store, product) => {
      store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
    }
  }, {name: 'CartStore', expiry: 1000 * 60 * 60 * 24 * 3}); // 3 days
  // CartStore.reset() // if for some reason, you want to reset the store

  // Define a middleware function
  const loggerMiddleware = (context) => {
    console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
  };

  // Use the middleware function with the initialState
  CartStore.use(loggerMiddleware);

  class ProductListElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');
    products = this.query({
      queryKey: ['products'],
      queryFn: () => {
        return fetch("https://api.camijs.com/products?_limit=3").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });

    addToCart(product) {
      CartStore.add(product);
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
        return html`<div>Error: ${this.products.error.message}</div>`;
      }

      if (this.products.data) {
        return html`
          <ul>
            ${this.products.data.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button class="md-button md-small" @click=${() => this.addToCart(product)} ?disabled=${this.isOutOfStock(product)}>
                  Add to cart
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }
  }

  customElements.define('product-list-cami-example-be', ProductListElement);

  class CartElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');

    get cartValue() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    }

    removeFromCart(product) {
      CartStore.remove(product);
    }

    template() {
      return html`
        <p>Note: Refresh the page to see that the cart is persisted to localStorage. You can also look at <code>Chrome DevTools > Application > Local Storage</code> to see the cart items.</p>
        <p>Cart value: $${(this.cartValue / 100).toFixed(2)}</p>
        <ul>
          ${this.cartItems.map(item => html`
            <li>${item.name} - $${(item.price / 100).toFixed(2)} <button class="md-button md-small" @click=${() => this.removeFromCart(item)}>Remove</button></li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('cart-cami-example', CartElement);
</script>

```
