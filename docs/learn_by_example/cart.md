# Cart with Server & Client State

This example fetches product data from an API using `query`. This also defines a `CartStore`, which has a `cartItems` array and two functions: `add` and `remove` (for adding and removing items from the cart). When you add or remove items from the cart, `CartStore.add` or `CartStore.remove` is called, which updates the `cartItems` array.

The `cartItems` array is then connected to the `CartElement` using `connect`, which updates the `cartItems` property on the `CartElement` whenever `CartStore.cartItems` is updated. This allows you to keep the cart in sync.

Lastly, the `CartStore`, by default, is persisted to localStorage. This means that if you refresh the page, the cart will still be there. You can also set the `expiry` option to set an expiry time for the store. For example, if you set `expiry` to 1000 * 60 * 60 * 24 * 3, then the store will expire after 3 days.

<iframe width="100%" height="300" src="//jsfiddle.net/kennyfrc12/qjs8c2gb/27embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML:

```html
 <article>
  <h2>Products</h2>
  <cami-product-list></cami-product-list>
</article>
<article>
  <h2>Cart</h2>
  <cami-cart></cami-cart>
</article>

<!-- <script src="./build/cami.cdn.js"></script> -->
<!-- CDN version below -->
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
<script type="module">
  const { html, ReactiveElement } = cami;

  const CartStore = cami.store({
    cartItems: [],
  },
  {
    name: 'CartStore',
    expiry: 1000 * 60 * 60 * 24 * 3
  }); // 3 days
  // CartStore.reset() // if for some reason, you want to reset the store

  CartStore.register('add', (state, payload) => {
    const newItem = {...payload, id: Date.now()}; // lame way to generate a unique id
    state.cartItems.push(newItem);
  });

  CartStore.register('remove', (state, payload) => {
    state.cartItems = state.cartItems.filter(item => item.id !== payload.id);
  });

  cami.debug.enable();

  // Define a middleware function
  const loggerMiddleware = (context) => {
    console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
  };

  // Use the middleware function with the initialState
  CartStore.use(loggerMiddleware);

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
      `
    }
  }

  customElements.define('cart-component', CartElement);
</script>
```
