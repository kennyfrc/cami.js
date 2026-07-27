# URLStore

The `URLStore` provides reactive hash routing, resource loading, and navigation hooks. Use it inside an island that owns client-side navigation; the rest of an MPA can keep using normal document requests.

## Overview

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore } from "cami";
    // Create the URL store
    const router = createURLStore({
        onChange: (state) => {
            console.log("URL changed:", state);
        },
    });
    // Register routes
    router.registerRoute("/posts/:id", {
        resources: ["post"],
        onEnter: ({ params }) => {
            console.log("Entering post", params.id);
        },
    });
    // Register resource loaders
    router.registerResourceLoader("post", async ({ params }) => {
        const response = await fetch(`/api/posts/${params.id}`);
        return response.json();
    });
    // Initialize
    await router.initialize();
    ```

=== "TypeScript"

    ```typescript
    import {
      createURLStore,
      type ResourceLoaderContext,
      type URLState,
    } from "cami";

    interface Post {
      id: string;
      title: string;
    }

    // Create the URL store
    const router = createURLStore({
      onChange: (state: URLState): void => {
        console.log("URL changed:", state);
      },
    });

    // Register routes
    router.registerRoute("/posts/:id", {
      resources: ["post"],
      onEnter: ({ params }): void => {
        console.log("Entering post", params.id);
      },
    });

    // Register resource loaders
    router.registerResourceLoader("post", async ({ params }: ResourceLoaderContext): Promise<void> => {
      const response = await fetch(`/api/posts/${params.id}`);
      const post = await response.json() as Post;
      console.log("Loaded post", post.title);
    });

    // Initialize
    await router.initialize();
    ```

---

## Creating a URL Store

### `createURLStore(options?)`

Creates a singleton URL store:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore } from "cami";
    const router = createURLStore({
        onInit: async (state) => {
            // Called once during initialization
            console.log("Initial URL state:", state);
        },
        onChange: (state) => {
            // Called on every URL change
            console.log("URL changed:", state);
        },
    });
    ```

=== "TypeScript"

    ```typescript
    import { createURLStore, type URLState } from "cami";

    const router = createURLStore({
      onInit: async (state: URLState): Promise<void> => {
        // Called once during initialization
        console.log("Initial URL state:", state);
      },
      onChange: (state: URLState): void => {
        // Called on every URL change
        console.log("URL changed:", state);
      },
    });
    ```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `onInit` | `(state) => void \| Promise<void>` | Called once during initialization |
| `onChange` | `(state) => void` | Called on every URL change |

---

## URL State

The URL store maintains state parsed from the current URL:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript

    ```

=== "TypeScript"

    ```typescript
    interface URLState {
      params: Record<string, string>;      // Query parameters (?key=value)
      hashPaths: string[];                  // Hash path segments (#/a/b/c)
      hashParams: Record<string, string>;  // Hash query params (#/path?key=value)
      routeParams?: Record<string, string>; // Matched route parameters
    }
    ```

### Reading State

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const state = router.getState();
    console.log(state.hashPaths); // ["posts", "123"]
    console.log(state.routeParams); // { id: "123" }
    ```

=== "TypeScript"

    ```typescript
    const state = router.getState();
    console.log(state.hashPaths);   // ["posts", "123"]
    console.log(state.routeParams); // { id: "123" }
    ```

---

## Routes

### `registerRoute(pattern, options?)`

Register a route pattern:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Simple route
    router.registerRoute("/posts");
    // Route with parameter
    router.registerRoute("/posts/:id");
    // Route with multiple parameters
    router.registerRoute("/users/:userId/posts/:postId");
    // Route with options
    router.registerRoute("/posts/:id", {
        resources: ["post", "comments"], // Resources to load
        params: {
            id: { persist: true }, // Persist param across navigations
        },
        onEnter: ({ state, params }) => {
            console.log("Entering post", params.id);
        },
        onLeave: ({ from, to }) => {
            console.log("Leaving post route");
        },
    });
    ```

=== "TypeScript"

    ```typescript
    // Simple route
    router.registerRoute("/posts");

    // Route with parameter
    router.registerRoute("/posts/:id");

    // Route with multiple parameters
    router.registerRoute("/users/:userId/posts/:postId");

    // Route with options
    router.registerRoute("/posts/:id", {
      resources: ["post", "comments"],  // Resources to load
      params: {
        id: { persist: true },  // Persist param across navigations
      },
      onEnter: ({ state, params }) => {
        console.log("Entering post", params.id);
      },
      onLeave: ({ from, to }) => {
        console.log("Leaving post route");
      },
    });
    ```

**Route Options:**

| Option | Type | Description |
|--------|------|-------------|
| `resources` | `string[]` | Resources to load before route activates |
| `params` | `Record<string, { persist?: boolean }>` | Parameter options |
| `onEnter` | `(context) => void \| Promise<void>` | Called when entering route |
| `onLeave` | `(context) => void \| Promise<void>` | Called when leaving route |

---

## Resource Loaders

### `registerResourceLoader(name, loader)`

Register a function to load route resources:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.registerResourceLoader("post", async ({ route, params, signal }) => {
        const response = await fetch(`/api/posts/${params.id}`, { signal });
        if (!response.ok)
            throw new Error("Failed to load post");
        return response.json();
    });
    router.registerResourceLoader("comments", async ({ params, signal }) => {
        const response = await fetch(`/api/posts/${params.id}/comments`, { signal });
        return response.json();
    });
    ```

=== "TypeScript"

    ```typescript
    router.registerResourceLoader("post", async ({ route, params, signal }) => {
      const response = await fetch(`/api/posts/${params.id}`, { signal });
      if (!response.ok) throw new Error("Failed to load post");
      return response.json();
    });

    router.registerResourceLoader("comments", async ({ params, signal }) => {
      const response = await fetch(`/api/posts/${params.id}/comments`, { signal });
      return response.json();
    });
    ```

**Loader Context:**

| Field | Type | Description |
|-------|------|-------------|
| `route` | `RouteDefinition` | Matched route definition |
| `params` | `Record<string, string>` | Route parameters |
| `url` | `string` | Current URL |
| `signal` | `AbortSignal` | Abort signal for cancellation |

---

## Navigation

### `navigate(options)`

Navigate to a new URL:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Navigate by path
    router.navigate({ path: "/posts/123" });
    // Update query parameters
    router.navigate({ params: { sort: "date", order: "desc" } });
    // Update hash parameters
    router.navigate({ hashParams: { tab: "comments" } });
    // Combined navigation
    router.navigate({
        path: "/posts/123",
        hashParams: { tab: "details" },
    });
    // Full replace (clear other params)
    router.navigate({
        path: "/posts/456",
        fullReplace: true,
    });
    // Shallow navigation (skip resource loading)
    router.navigate({
        path: "/posts/789",
        shallow: true,
    });
    ```

=== "TypeScript"

    ```typescript
    // Navigate by path
    router.navigate({ path: "/posts/123" });

    // Update query parameters
    router.navigate({ params: { sort: "date", order: "desc" } });

    // Update hash parameters
    router.navigate({ hashParams: { tab: "comments" } });

    // Combined navigation
    router.navigate({
      path: "/posts/123",
      hashParams: { tab: "details" },
    });

    // Full replace (clear other params)
    router.navigate({
      path: "/posts/456",
      fullReplace: true,
    });

    // Shallow navigation (skip resource loading)
    router.navigate({
      path: "/posts/789",
      shallow: true,
    });
    ```

**Navigate Options:**

| Option | Type | Description |
|--------|------|-------------|
| `path` | `string` | Hash path to navigate to |
| `params` | `Record<string, string \| null>` | Query parameters (null removes) |
| `hashParams` | `Record<string, string \| null>` | Hash query parameters |
| `fullReplace` | `boolean` | Clear other params on navigate |
| `shallow` | `boolean` | Skip resource loading |
| `focusSelector` | `string` | Element to focus after navigation |
| `pageTitle` | `string` | Update document title |
| `announcement` | `string` | Accessibility announcement |

---

## Navigation Hooks

### `beforeNavigate(hook)`

Run code before navigation:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.beforeNavigate(async ({ from, to, route }) => {
        // Check authentication
        if (route?.pattern.startsWith("/admin") && !isAuthenticated()) {
            router.navigate({ path: "/login" });
            return; // Cancel navigation
        }
    });
    // Guard navigation with confirmation
    router.beforeNavigate(({ from }) => {
        if (hasUnsavedChanges()) {
            if (!confirm("You have unsaved changes. Leave anyway?")) {
                return; // Cancel navigation
            }
        }
    });
    ```

=== "TypeScript"

    ```typescript
    router.beforeNavigate(async ({ from, to, route }) => {
      // Check authentication
      if (route?.pattern.startsWith("/admin") && !isAuthenticated()) {
        router.navigate({ path: "/login" });
        return; // Cancel navigation
      }
    });

    // Guard navigation with confirmation
    router.beforeNavigate(({ from }) => {
      if (hasUnsavedChanges()) {
        if (!confirm("You have unsaved changes. Leave anyway?")) {
          return; // Cancel navigation
        }
      }
    });
    ```

### `afterNavigate(hook)`

Run code after navigation completes:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.afterNavigate(({ from, to, route }) => {
        // Analytics tracking
        analytics.trackPageView(to.hashPaths.join("/"));
        // Scroll to top
        window.scrollTo(0, 0);
    });
    ```

=== "TypeScript"

    ```typescript
    router.afterNavigate(({ from, to, route }) => {
      // Analytics tracking
      analytics.trackPageView(to.hashPaths.join("/"));

      // Scroll to top
      window.scrollTo(0, 0);
    });
    ```

---

## Bootstrap

### `bootstrap(loader)`

Register a function to run once before the first route:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.bootstrap(async () => {
        // Load initial data, check auth, etc.
        const user = await checkAuthentication();
        UserStore.dispatch("setUser", user);
    });
    // Initialize must be called to start routing
    await router.initialize();
    ```

=== "TypeScript"

    ```typescript
    router.bootstrap(async () => {
      // Load initial data, check auth, etc.
      const user = await checkAuthentication();
      UserStore.dispatch("setUser", user);
    });

    // Initialize must be called to start routing
    await router.initialize();
    ```

### `initialize()`

Start the router and process the initial URL:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    await router.initialize();
    ```

=== "TypeScript"

    ```typescript
    await router.initialize();
    ```

---

## Route Matching

### `matches(pattern)`

Check if the current URL matches a pattern:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    if (router.matches("/posts/:id")) {
        console.log("On a post page");
    }
    ```

=== "TypeScript"

    ```typescript
    if (router.matches("/posts/:id")) {
      console.log("On a post page");
    }
    ```

### `getActiveRoute()`

Get the currently matched route:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const route = router.getActiveRoute();
    if (route) {
        console.log("Current pattern:", route.pattern);
        console.log("Route params:", route.extractedParams);
    }
    ```

=== "TypeScript"

    ```typescript
    const route = router.getActiveRoute();
    if (route) {
      console.log("Current pattern:", route.pattern);
      console.log("Route params:", route.extractedParams);
    }
    ```

---

## Navigation State

### `isLoading()`

Check if resources are currently loading:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    if (router.isLoading()) {
        // Show loading indicator
    }
    ```

=== "TypeScript"

    ```typescript
    if (router.isLoading()) {
      // Show loading indicator
    }
    ```

### `isPending()`

Check if navigation is pending:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    if (router.isPending()) {
        // Navigation in progress
    }
    ```

=== "TypeScript"

    ```typescript
    if (router.isPending()) {
      // Navigation in progress
    }
    ```

---

## Using with Components

Here's how to use URLStore with ReactiveElement:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore, store, html, ReactiveElement } from "cami";
    // Create stores
    const router = createURLStore();
    const AppStore = store({
        name: "AppStore",
        state: {
            currentPost: null,
            loading: false,
        },
    });
    // Define actions
    AppStore.defineAction("setPost", ({ state, payload }) => {
        state.currentPost = payload;
        state.loading = false;
    });
    AppStore.defineAction("setLoading", ({ state }) => {
        state.loading = true;
    });
    // Register routes
    router.registerRoute("/", {
        onEnter: () => AppStore.dispatch("setPost", null),
    });
    router.registerRoute("/posts/:id", {
        resources: ["post"],
        onEnter: () => AppStore.dispatch("setLoading"),
    });
    // Register resource loader
    router.registerResourceLoader("post", async ({ params }) => {
        const response = await fetch(`/api/posts/${params.id}`);
        const post = await response.json();
        AppStore.dispatch("setPost", post);
        return post;
    });
    // Initialize
    router.initialize();
    // Router-aware component
    class App extends ReactiveElement {
        template() {
            const state = router.getState();
            const { currentPost, loading } = AppStore.getState();
            return html `
          <nav>
            <a href="#/" @click=${(e) => this.handleNav(e, "/")}>Home</a>
            <a href="#/posts/1" @click=${(e) => this.handleNav(e, "/posts/1")}>Post 1</a>
            <a href="#/posts/2" @click=${(e) => this.handleNav(e, "/posts/2")}>Post 2</a>
          </nav>

          <main>
            ${loading
                ? html `<div>Loading...</div>`
                : currentPost
                    ? html `<article><h1>${currentPost.title}</h1><p>${currentPost.body}</p></article>`
                    : html `<div>Welcome! Select a post.</div>`}
          </main>
        `;
        }
        handleNav(e, path) {
            e.preventDefault();
            router.navigate({ path });
        }
    }
    customElements.define("app-root", App);
    ```

=== "TypeScript"

    ```typescript
    import { createURLStore, store, html, ReactiveElement } from "cami";

    // Create stores
    const router = createURLStore();
    const AppStore = store({
      name: "AppStore",
      state: {
        currentPost: null,
        loading: false,
      },
    });

    // Define actions
    AppStore.defineAction("setPost", ({ state, payload }) => {
      state.currentPost = payload;
      state.loading = false;
    });

    AppStore.defineAction("setLoading", ({ state }) => {
      state.loading = true;
    });

    // Register routes
    router.registerRoute("/", {
      onEnter: () => AppStore.dispatch("setPost", null),
    });

    router.registerRoute("/posts/:id", {
      resources: ["post"],
      onEnter: () => AppStore.dispatch("setLoading"),
    });

    // Register resource loader
    router.registerResourceLoader("post", async ({ params }) => {
      const response = await fetch(`/api/posts/${params.id}`);
      const post = await response.json();
      AppStore.dispatch("setPost", post);
      return post;
    });

    // Initialize
    router.initialize();

    // Router-aware component
    class App extends ReactiveElement {
      template() {
        const state = router.getState();
        const { currentPost, loading } = AppStore.getState();

        return html`
          <nav>
            <a href="#/" @click=${(e) => this.handleNav(e, "/")}>Home</a>
            <a href="#/posts/1" @click=${(e) => this.handleNav(e, "/posts/1")}>Post 1</a>
            <a href="#/posts/2" @click=${(e) => this.handleNav(e, "/posts/2")}>Post 2</a>
          </nav>

          <main>
            ${loading
              ? html`<div>Loading...</div>`
              : currentPost
                ? html`<article><h1>${currentPost.title}</h1><p>${currentPost.body}</p></article>`
                : html`<div>Welcome! Select a post.</div>`
            }
          </main>
        `;
      }

      handleNav(e, path) {
        e.preventDefault();
        router.navigate({ path });
      }
    }

    customElements.define("app-root", App);
    ```

---

## Complete Example

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore, store } from "cami";
    // Create the router
    const router = createURLStore({
        onChange: (state) => {
            console.log("Route:", state.hashPaths.join("/"));
        },
    });
    // App store for data
    const AppStore = store({
        name: "AppStore",
        state: {
            user: null,
            posts: [],
            currentPost: null,
            loading: false,
            error: null,
        },
    });
    // Actions
    AppStore.defineAction("setUser", ({ state, payload }) => {
        state.user = payload;
    });
    AppStore.defineAction("setPosts", ({ state, payload }) => {
        state.posts = payload;
    });
    AppStore.defineAction("setCurrentPost", ({ state, payload }) => {
        state.currentPost = payload;
        state.loading = false;
    });
    AppStore.defineAction("setLoading", ({ state, payload }) => {
        state.loading = payload;
    });
    AppStore.defineAction("setError", ({ state, payload }) => {
        state.error = payload;
        state.loading = false;
    });
    // Bootstrap: check auth
    router.bootstrap(async () => {
        try {
            const response = await fetch("/api/me");
            if (response.ok) {
                const user = await response.json();
                AppStore.dispatch("setUser", user);
            }
        }
        catch (e) {
            console.log("Not authenticated");
        }
    });
    // Routes
    router.registerRoute("/", {
        onEnter: () => {
            AppStore.dispatch("setCurrentPost", null);
        },
    });
    router.registerRoute("/posts", {
        resources: ["posts"],
        onEnter: () => AppStore.dispatch("setLoading", true),
    });
    router.registerRoute("/posts/:id", {
        resources: ["post"],
        onEnter: () => AppStore.dispatch("setLoading", true),
    });
    router.registerRoute("/login");
    // Resource loaders
    router.registerResourceLoader("posts", async ({ signal }) => {
        const response = await fetch("/api/posts", { signal });
        const posts = await response.json();
        AppStore.dispatch("setPosts", posts);
        return posts;
    });
    router.registerResourceLoader("post", async ({ params, signal }) => {
        const response = await fetch(`/api/posts/${params.id}`, { signal });
        const post = await response.json();
        AppStore.dispatch("setCurrentPost", post);
        return post;
    });
    // Navigation guards
    router.beforeNavigate(({ to, route }) => {
        const { user } = AppStore.getState();
        // Protect admin routes
        if (route?.pattern.startsWith("/admin") && !user) {
            router.navigate({ path: "/login" });
            return;
        }
    });
    router.afterNavigate(() => {
        window.scrollTo(0, 0);
    });
    // Start routing
    router.initialize();
    ```

=== "TypeScript"

    ```typescript
    import { createURLStore, store, html, ReactiveElement } from "cami";

    // Create the router
    const router = createURLStore({
      onChange: (state) => {
        console.log("Route:", state.hashPaths.join("/"));
      },
    });

    // App store for data
    const AppStore = store({
      name: "AppStore",
      state: {
        user: null,
        posts: [],
        currentPost: null,
        loading: false,
        error: null,
      },
    });

    // Actions
    AppStore.defineAction("setUser", ({ state, payload }) => {
      state.user = payload;
    });

    AppStore.defineAction("setPosts", ({ state, payload }) => {
      state.posts = payload;
    });

    AppStore.defineAction("setCurrentPost", ({ state, payload }) => {
      state.currentPost = payload;
      state.loading = false;
    });

    AppStore.defineAction("setLoading", ({ state, payload }) => {
      state.loading = payload;
    });

    AppStore.defineAction("setError", ({ state, payload }) => {
      state.error = payload;
      state.loading = false;
    });

    // Bootstrap: check auth
    router.bootstrap(async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const user = await response.json();
          AppStore.dispatch("setUser", user);
        }
      } catch (e) {
        console.log("Not authenticated");
      }
    });

    // Routes
    router.registerRoute("/", {
      onEnter: () => {
        AppStore.dispatch("setCurrentPost", null);
      },
    });

    router.registerRoute("/posts", {
      resources: ["posts"],
      onEnter: () => AppStore.dispatch("setLoading", true),
    });

    router.registerRoute("/posts/:id", {
      resources: ["post"],
      onEnter: () => AppStore.dispatch("setLoading", true),
    });

    router.registerRoute("/login");

    // Resource loaders
    router.registerResourceLoader("posts", async ({ signal }) => {
      const response = await fetch("/api/posts", { signal });
      const posts = await response.json();
      AppStore.dispatch("setPosts", posts);
      return posts;
    });

    router.registerResourceLoader("post", async ({ params, signal }) => {
      const response = await fetch(`/api/posts/${params.id}`, { signal });
      const post = await response.json();
      AppStore.dispatch("setCurrentPost", post);
      return post;
    });

    // Navigation guards
    router.beforeNavigate(({ to, route }) => {
      const { user } = AppStore.getState();

      // Protect admin routes
      if (route?.pattern.startsWith("/admin") && !user) {
        router.navigate({ path: "/login" });
        return;
      }
    });

    router.afterNavigate(() => {
      window.scrollTo(0, 0);
    });

    // Start routing
    router.initialize();
    ```

---

## API Reference

### Factory

| Function | Description |
|----------|-------------|
| `createURLStore(options?)` | Create or get singleton URLStore |

### Instance Methods

| Method | Description |
|--------|-------------|
| `registerRoute(pattern, options?)` | Register a route |
| `registerResourceLoader(name, loader)` | Register a resource loader |
| `beforeNavigate(hook)` | Add before-navigation hook |
| `afterNavigate(hook)` | Add after-navigation hook |
| `bootstrap(loader)` | Register bootstrap function |
| `initialize()` | Start the router |
| `navigate(options)` | Navigate to a URL |
| `getState()` | Get current URL state |
| `matches(pattern)` | Check if pattern matches |
| `getActiveRoute()` | Get current matched route |
| `isLoading()` | Check if resources are loading |
| `isPending()` | Check if navigation is pending |
| `subscribe(observer)` | Subscribe to URL changes |
