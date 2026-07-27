const { html, ReactiveElement, store } = cami
const AppStore = store({
    name: 'AppStore',
    state: {
        cartItems: [],
        products: { status: 'idle', data: [], error: null },
    },
});
AppStore.defineAction('cart:add', ({ state, payload }) => {
    const product = payload;
    state.cartItems.push({ ...product, cartItemId: crypto.randomUUID() });
});
AppStore.defineAction('cart:remove', ({ state, payload }) => {
    const { cartItemId } = payload;
    state.cartItems = state.cartItems.filter((item) => item.cartItemId !== cartItemId);
});
AppStore.defineAction('products:setPending', ({ state }) => {
    state.products.status = 'pending';
    state.products.error = null;
});
AppStore.defineAction('products:setSuccess', ({ state, payload }) => {
    state.products = { status: 'success', data: payload, error: null };
});
AppStore.defineAction('products:setError', ({ state, payload }) => {
    state.products.status = 'error';
    state.products.error = payload instanceof Error ? payload.message : String(payload);
});
AppStore.defineQuery('products:fetch', {
    queryKey: ['products'],
    queryFn: async () => {
        const response = await fetch('https://cami-api.exe.xyz/products?_limit=3');
        if (!response.ok)
            throw new Error(`Products request failed: ${response.status}`);
        return await response.json();
    },
    staleTime: 5 * 60_000,
    onFetch: ({ dispatch }) => dispatch('products:setPending'),
    onSuccess: ({ data, dispatch }) => dispatch('products:setSuccess', data),
    onError: ({ error, dispatch }) => dispatch('products:setError', error),
});
AppStore.defineMemo('cart:total', ({ state }) => state.cartItems.reduce((total, item) => total + item.price, 0));
void AppStore.query('products:fetch');
class ProductListElement extends ReactiveElement {
    isProductInCart(productId) {
        return AppStore.getState().cartItems.some((item) => item.id === productId);
    }
    template() {
        const { products } = AppStore.getState();
        if (products.status === 'pending')
            return html `<p>Loading…</p>`;
        if (products.error)
            return html `<p role="alert">${products.error}</p>`;
        return html `<ul>${products.data.map((product) => html `
      <li>
        ${product.name} — ${(product.price / 100).toFixed(2)}
        <button
          @click=${() => AppStore.dispatch('cart:add', product)}
          ?disabled=${product.stock === 0 || this.isProductInCart(product.id)}
        >${this.isProductInCart(product.id) ? 'In Cart' : 'Add to cart'}</button>
      </li>
    `)}</ul>`;
    }
}
class CartElement extends ReactiveElement {
    template() {
        const { cartItems } = AppStore.getState();
        const total = AppStore.memo('cart:total');
        if (cartItems.length === 0)
            return html `<p>Cart is empty</p>`;
        return html `
      <p>Cart value: ${(total / 100).toFixed(2)}</p>
      <ul>${cartItems.map((item) => html `
        <li>${item.name} <button @click=${() => AppStore.dispatch('cart:remove', item)}>Remove</button></li>
      `)}</ul>
    `;
    }
}
customElements.define('product-list-component', ProductListElement);
customElements.define('cart-component', CartElement);
