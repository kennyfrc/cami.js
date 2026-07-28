# Cross-Component Client State Management

In Cami, cross-component state management is achieved through stores. A store is a reactive state container that components can read from and dispatch actions to. This enables multiple components to share the same state and stay in sync.

## Creating a Store

Use the `store()` function to create a store with initial state:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { store } = cami;

    const CartStore = store({
      name: "CartStore",
      state: {
        cartItems: [],
      },
    });
    ```

=== "TypeScript"

    ```typescript
    import { store } from 'cami';

    interface CartItem {
      id: string;
      name: string;
      price: number;
    }

    interface CartState {
      cartItems: CartItem[];
    }

    const CartStore = store<CartState>({
      name: "CartStore",
      state: {
        cartItems: [],
      },
    });
    ```

The `name` option is used for debugging and singleton behavior—calling `store({ name: "CartStore" })` again returns the same instance.

## Defining Actions

Actions are the only way to modify store state. Use `defineAction()` to register them:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    CartStore.defineAction("add", ({ state, payload }) => {
      const newItem = { ...payload, id: Date.now().toString() };
      state.cartItems.push(newItem);
    });

    CartStore.defineAction("remove", ({ state, payload }) => {
      state.cartItems = state.cartItems.filter(item => item.id !== payload.id);
    });

    CartStore.defineAction("clear", ({ state }) => {
      state.cartItems = [];
    });
    ```

=== "TypeScript"

    ```typescript
    CartStore.defineAction("add", ({ state, payload }) => {
      const newItem: CartItem = { ...(payload as Omit<CartItem, 'id'>), id: crypto.randomUUID() };
      state.cartItems.push(newItem);
    });

    CartStore.defineAction("remove", ({ state, payload }) => {
      const { id } = payload as Pick<CartItem, 'id'>;
      state.cartItems = state.cartItems.filter((item: CartItem) => item.id !== id);
    });

    CartStore.defineAction("clear", ({ state }) => {
      state.cartItems = [];
    });
    ```

Inside the action handler, you mutate `state` directly—Immer handles the immutable update behind the scenes.

## Reading State in Components

Components read state using `getState()`. When called inside `template()`, it automatically registers a dependency so the component re-renders when state changes:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class CartElement extends ReactiveElement {
      template() {
        const { cartItems } = CartStore.getState();

        if (cartItems.length === 0) {
          return html`<p>Cart is empty</p>`;
        }

        const total = cartItems.reduce((acc, item) => acc + item.price, 0);

        return html`
          <p>Cart value: $${(total / 100).toFixed(2)}</p>
          <ul>
            ${cartItems.map(item => html`
              <li>
                ${item.name} - $${(item.price / 100).toFixed(2)}
                <button @click=${() => CartStore.dispatch("remove", item)}>Remove</button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('cart-component', CartElement);
    ```

=== "TypeScript"

    ```typescript
    class CartElement extends ReactiveElement {
      template(): ReturnType<typeof html> {
        const { cartItems } = CartStore.getState();

        if (cartItems.length === 0) {
          return html`<p>Cart is empty</p>`;
        }

        const total: number = cartItems.reduce((acc: number, item: CartItem) => acc + item.price, 0);

        return html`
          <p>Cart value: $${(total / 100).toFixed(2)}</p>
          <ul>
            ${cartItems.map((item: CartItem) => html`
              <li>
                ${item.name} - $${(item.price / 100).toFixed(2)}
                <button @click=${() => CartStore.dispatch("remove", item)}>Remove</button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('cart-component', CartElement);
    ```

## Dispatching Actions

Dispatch actions from event handlers to update state:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class ProductListElement extends ReactiveElement {
      products = [
        { id: "1", name: "Widget", price: 999, stock: 5 },
        { id: "2", name: "Gadget", price: 1999, stock: 3 },
        { id: "3", name: "Doohickey", price: 499, stock: 0 },
      ];

      isInCart(product) {
        const { cartItems } = CartStore.getState();
        return cartItems.some(item => item.id === product.id);
      }

      template() {
        return html`
          <ul>
            ${this.products.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button
                  @click=${() => CartStore.dispatch("add", product)}
                  ?disabled=${product.stock === 0 || this.isInCart(product)}>
                  ${this.isInCart(product) ? "In Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('product-list-component', ProductListElement);
    ```

=== "TypeScript"

    ```typescript
    interface Product {
      id: string;
      name: string;
      price: number;
      stock: number;
    }

    class ProductListElement extends ReactiveElement {
      products: Product[] = [
        { id: "1", name: "Widget", price: 999, stock: 5 },
        { id: "2", name: "Gadget", price: 1999, stock: 3 },
        { id: "3", name: "Doohickey", price: 499, stock: 0 },
      ];

      isInCart(product: Product): boolean {
        const { cartItems } = CartStore.getState();
        return cartItems.some((item: CartItem) => item.id === product.id);
      }

      template(): ReturnType<typeof html> {
        return html`
          <ul>
            ${this.products.map((product: Product) => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button
                  @click=${() => CartStore.dispatch("add", product)}
                  ?disabled=${product.stock === 0 || this.isInCart(product)}>
                  ${this.isInCart(product) ? "In Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('product-list-component', ProductListElement);
    ```

## Using Memos for Derived State

For computed values that are used in multiple places or are expensive to calculate, use memos:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    CartStore.defineMemo("cartTotal", ({ state }) => {
      return state.cartItems.reduce((acc, item) => acc + item.price, 0);
    });

    CartStore.defineMemo("cartCount", ({ state }) => {
      return state.cartItems.length;
    });

    // In a component
    class CartSummary extends ReactiveElement {
      template() {
        const total = CartStore.memo("cartTotal");
        const count = CartStore.memo("cartCount");

        return html`
          <div>
            <span>Items: ${count}</span>
            <span>Total: $${(total / 100).toFixed(2)}</span>
          </div>
        `;
      }
    }
    ```

=== "TypeScript"

    ```typescript
    CartStore.defineMemo<number>("cartTotal", ({ state }) => {
      return state.cartItems.reduce((acc: number, item: CartItem) => acc + item.price, 0);
    });

    CartStore.defineMemo<number>("cartCount", ({ state }) => {
      return state.cartItems.length;
    });

    // In a component
    class CartSummary extends ReactiveElement {
      template(): ReturnType<typeof html> {
        const total = CartStore.memo("cartTotal") as number;
        const count = CartStore.memo("cartCount") as number;

        return html`
          <div>
            <span>Items: ${count}</span>
            <span>Total: $${(total / 100).toFixed(2)}</span>
          </div>
        `;
      }
    }
    ```

## Adding Hooks for Side Effects

Hooks let you run code before or after actions. This is useful for logging, analytics, or persistence:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Logging hook
    CartStore.beforeHook(({ action, payload }) => {
      console.log(`[CartStore] ${action}`, payload);
    });

    // Persistence hook
    CartStore.afterHook(({ state }) => {
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    });

    // Load persisted state on startup
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      CartStore.defineAction("hydrate", ({ state, payload }) => {
        state.cartItems = payload;
      });
      CartStore.dispatch("hydrate", JSON.parse(savedCart));
    }
    ```

=== "TypeScript"

    ```typescript
    // Logging hook
    CartStore.beforeHook(({ action, payload }) => {
      console.log(`[CartStore] ${action}`, payload);
    });

    // Persistence hook
    CartStore.afterHook(({ state }) => {
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    });

    // Load persisted state on startup
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      CartStore.defineAction("hydrate", ({ state, payload }) => {
        state.cartItems = payload;
      });
      CartStore.dispatch("hydrate", JSON.parse(savedCart));
    }
    ```

## Complete Example

Here's a full working example with multiple components sharing cart state:

```html
<product-list-component></product-list-component>
<cart-component></cart-component>

<script src="https://unpkg.com/cami@0.4/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

### Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { store, html, ReactiveElement } = cami;

    // Create the store
    const CartStore = store({
      name: "CartStore",
      state: { cartItems: [] },
    });

    // Define actions
    CartStore.defineAction("add", ({ state, payload }) => {
      state.cartItems.push({ ...payload, cartItemId: Date.now().toString() });
    });

    CartStore.defineAction("remove", ({ state, payload }) => {
      state.cartItems = state.cartItems.filter(item => item.cartItemId !== payload.cartItemId);
    });

    // Define memos
    CartStore.defineMemo("cartTotal", ({ state }) => {
      return state.cartItems.reduce((acc, item) => acc + item.price, 0);
    });

    // Product list component
    class ProductListElement extends ReactiveElement {
      products = [
        { id: "1", name: "Widget", price: 999, stock: 5 },
        { id: "2", name: "Gadget", price: 1999, stock: 3 },
        { id: "3", name: "Doohickey", price: 499, stock: 0 },
      ];

      template() {
        // Read cart state to check if items are already added
        const { cartItems } = CartStore.getState();

        const isInCart = (product) => cartItems.some(item => item.id === product.id);

        return html`
          <h3>Products</h3>
          <ul>
            ${this.products.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button
                  @click=${() => CartStore.dispatch("add", product)}
                  ?disabled=${product.stock === 0 || isInCart(product)}>
                  ${isInCart(product) ? "In Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    // Cart component
    class CartElement extends ReactiveElement {
      template() {
        const { cartItems } = CartStore.getState();
        const total = CartStore.memo("cartTotal");

        if (cartItems.length === 0) {
          return html`<p>Cart is empty</p>`;
        }

        return html`
          <h3>Cart</h3>
          <p>Total: $${(total / 100).toFixed(2)}</p>
          <ul>
            ${cartItems.map(item => html`
              <li>
                ${item.name} - $${(item.price / 100).toFixed(2)}
                <button @click=${() => CartStore.dispatch("remove", item)}>Remove</button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('product-list-component', ProductListElement);
    customElements.define('cart-component', CartElement);
    ```

=== "TypeScript"

    ```typescript
    import { store, html, ReactiveElement } from 'cami'

    // Create the store
    const CartStore = store({
      name: "CartStore",
      state: { cartItems: [] },
    });

    // Define actions
    CartStore.defineAction("add", ({ state, payload }) => {
      state.cartItems.push({ ...payload, cartItemId: Date.now().toString() });
    });

    CartStore.defineAction("remove", ({ state, payload }) => {
      state.cartItems = state.cartItems.filter(item => item.cartItemId !== payload.cartItemId);
    });

    // Define memos
    CartStore.defineMemo("cartTotal", ({ state }) => {
      return state.cartItems.reduce((acc, item) => acc + item.price, 0);
    });

    // Product list component
    class ProductListElement extends ReactiveElement {
      products = [
        { id: "1", name: "Widget", price: 999, stock: 5 },
        { id: "2", name: "Gadget", price: 1999, stock: 3 },
        { id: "3", name: "Doohickey", price: 499, stock: 0 },
      ];

      template() {
        // Read cart state to check if items are already added
        const { cartItems } = CartStore.getState();

        const isInCart = (product) => cartItems.some(item => item.id === product.id);

        return html`
          <h3>Products</h3>
          <ul>
            ${this.products.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button
                  @click=${() => CartStore.dispatch("add", product)}
                  ?disabled=${product.stock === 0 || isInCart(product)}>
                  ${isInCart(product) ? "In Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    // Cart component
    class CartElement extends ReactiveElement {
      template() {
        const { cartItems } = CartStore.getState();
        const total = CartStore.memo("cartTotal");

        if (cartItems.length === 0) {
          return html`<p>Cart is empty</p>`;
        }

        return html`
          <h3>Cart</h3>
          <p>Total: $${(total / 100).toFixed(2)}</p>
          <ul>
            ${cartItems.map(item => html`
              <li>
                ${item.name} - $${(item.price / 100).toFixed(2)}
                <button @click=${() => CartStore.dispatch("remove", item)}>Remove</button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('product-list-component', ProductListElement);
    customElements.define('cart-component', CartElement);
    ```

## Best Practices

1. **Keep components pure**: Components should read state and dispatch actions, not hold local mirrors of store state.

2. **Use memos for derived state**: Instead of computing values in multiple components, define memos once in the store.

3. **Name your stores**: Use descriptive names for easier debugging.

4. **Use hooks for side effects**: Persistence, logging, and analytics belong in hooks, not in action handlers.

See the [Best Practices](../best_practices.md) page for more production patterns.
