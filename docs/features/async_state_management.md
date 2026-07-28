# Asynchronous Server State Management

Cami provides a powerful async state management system through store-level queries and mutations. Queries fetch data and cache it, while mutations update server data and can perform optimistic updates.

!!! info "Example backend"
    Requests in this guide use `https://cami-api.exe.xyz`, a public mock API deployed for Cami examples. Its data may change as readers create, update, and delete records. Use your own application endpoint in production.

## Queries

Queries are used to fetch data asynchronously with built-in caching, refetching, and lifecycle callbacks.

### Setting Up a Query

First, define your state shape, actions to update it, and then the query:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { store, html, ReactiveElement } = cami;

    // 1. Define state shape
    const PostsStore = store({
      name: "PostsStore",
      state: {
        posts: {
          status: "idle",  // "idle" | "pending" | "success" | "error"
          data: [],
          error: null,
        },
      },
    });

    // 2. Define actions to update state
    PostsStore.defineAction("posts:setPending", ({ state }) => {
      state.posts.status = "pending";
      state.posts.error = null;
    });

    PostsStore.defineAction("posts:setSuccess", ({ state, payload }) => {
      state.posts.status = "success";
      state.posts.data = payload;
    });

    PostsStore.defineAction("posts:setError", ({ state, payload }) => {
      state.posts.status = "error";
      state.posts.error = payload.message || String(payload);
    });

    // 3. Define the query
    PostsStore.defineQuery("posts:fetch", {
      queryKey: ["posts"],
      queryFn: () => fetch("https://cami-api.exe.xyz/posts?_limit=5").then(r => r.json()),
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      onFetch: ({ dispatch }) => {
        dispatch("posts:setPending");
      },
      onSuccess: ({ data, dispatch }) => {
        dispatch("posts:setSuccess", data);
      },
      onError: ({ error, dispatch }) => {
        dispatch("posts:setError", error);
      },
    });
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement, store } from 'cami';

    type RequestStatus = "idle" | "pending" | "success" | "error";

    interface Post {
      id: number;
      title: string;
      body: string;
    }

    interface PostsState {
      posts: {
        status: RequestStatus;
        data: Post[];
        error: string | null;
      };
    }

    // 1. Define state shape
    const PostsStore = store<PostsState>({
      name: "PostsStore",
      state: {
        posts: {
          status: "idle",  // "idle" | "pending" | "success" | "error"
          data: [],
          error: null,
        },
      },
    });

    // 2. Define actions to update state
    PostsStore.defineAction("posts:setPending", ({ state }) => {
      state.posts.status = "pending";
      state.posts.error = null;
    });

    PostsStore.defineAction("posts:setSuccess", ({ state, payload }) => {
      state.posts.status = "success";
      state.posts.data = payload as Post[];
    });

    PostsStore.defineAction("posts:setError", ({ state, payload }) => {
      state.posts.status = "error";
      state.posts.error = payload instanceof Error ? payload.message : String(payload);
    });

    // 3. Define the query
    PostsStore.defineQuery<void, Post[]>("posts:fetch", {
      queryKey: ["posts"],
      queryFn: async (): Promise<Post[]> => {
        const response = await fetch("https://cami-api.exe.xyz/posts?_limit=5");
        return await response.json() as Post[];
      },
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      onFetch: ({ dispatch }) => {
        dispatch("posts:setPending");
      },
      onSuccess: ({ data, dispatch }) => {
        dispatch("posts:setSuccess", data);
      },
      onError: ({ error, dispatch }) => {
        dispatch("posts:setError", error);
      },
    });
    ```

### Triggering Queries

Queries should be triggered at the **application level**, not in component lifecycle methods like `onConnect()`. This ensures data is fetched once when needed, not every time a component mounts.

**Option 1: Bootstrap function (recommended for initial data)**

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Bootstrap runs once at app startup
    async function bootstrapApp() {
      await PostsStore.query("posts:fetch");
    }
    bootstrapApp();
    ```

=== "TypeScript"

    ```typescript
    // Bootstrap runs once at app startup
    async function bootstrapApp(): Promise<void> {
      await PostsStore.query<Post[]>("posts:fetch");
    }
    bootstrapApp();
    ```

**Option 2: URL-based routing with URLStore**

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore } from "cami";

    const router = createURLStore();

    // Data loads when navigating to this route
    router.registerRoute("/posts", {
      onEnter: async (): Promise<void> => {
        await PostsStore.query<Post[]>("posts:fetch");
      },
    });

    router.initialize();
    ```

=== "TypeScript"

    ```typescript
    import { createURLStore } from "cami";

    const router = createURLStore();

    // Data loads when navigating to this route
    router.registerRoute("/posts", {
      onEnter: async () => {
        await PostsStore.query("posts:fetch");
      },
    });

    router.initialize();
    ```

**Option 3: User-initiated (button click)**

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class BlogPostsElement extends ReactiveElement {
      template() {
        const { posts } = PostsStore.getState();

        return html`
          <button @click=${() => PostsStore.query("posts:fetch")}>
            Load Posts
          </button>
          ${this.renderPosts(posts)}
        `;
      }
    }
    ```

=== "TypeScript"

    ```typescript
    class BlogPostsElement extends ReactiveElement {
      template(): ReturnType<typeof html> {
        const { posts } = PostsStore.getState();

        return html`
          <button @click=${() => PostsStore.query<Post[]>("posts:fetch")}>
            Load Posts
          </button>
          ${this.renderPosts(posts)}
        `;
      }
    }
    ```

### Rendering Query State

Components are pure renderers—they read state and display it:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class BlogPostsElement extends ReactiveElement {
      template() {
        const { posts } = PostsStore.getState();

        if (posts.status === "pending") {
          return html`<div>Loading...</div>`;
        }

        if (posts.status === "error") {
          return html`<div>Error: ${posts.error}</div>`;
        }

        if (posts.status === "success") {
          return html`
            <ul>
              ${posts.data.map(post => html`
                <li>
                  <h3>${post.title}</h3>
                  <p>${post.body}</p>
                </li>
              `)}
            </ul>
          `;
        }

        return html`<div>No posts loaded</div>`;
      }
    }

    customElements.define('blog-posts-element', BlogPostsElement);
    ```

=== "TypeScript"

    ```typescript
    class BlogPostsElement extends ReactiveElement {
      template() {
        const { posts } = PostsStore.getState();

        if (posts.status === "pending") {
          return html`<div>Loading...</div>`;
        }

        if (posts.status === "error") {
          return html`<div>Error: ${posts.error}</div>`;
        }

        if (posts.status === "success") {
          return html`
            <ul>
              ${posts.data.map(post => html`
                <li>
                  <h3>${post.title}</h3>
                  <p>${post.body}</p>
                </li>
              `)}
            </ul>
          `;
        }

        return html`<div>No posts loaded</div>`;
      }
    }

    customElements.define('blog-posts-element', BlogPostsElement);
    ```

### Refetching Data

Trigger a refetch via user interaction (button click):

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class BlogPostsElement extends ReactiveElement {
      template() {
        const { posts } = PostsStore.getState();

        return html`
          <button @click=${() => PostsStore.query("posts:fetch")}>Refetch Posts</button>
          ${this.renderPosts(posts)}
        `;
      }

      renderPosts(posts) {
        if (posts.status === "pending") {
          return html`<div>Loading...</div>`;
        }

        if (posts.status === "error") {
          return html`<div>Error: ${posts.error}</div>`;
        }

        return html`
          <ul>
            ${posts.data.map(post => html`
              <li><h3>${post.title}</h3></li>
            `)}
          </ul>
        `;
      }
    }
    ```

=== "TypeScript"

    ```typescript
    class BlogPostsElement extends ReactiveElement {
      template() {
        const { posts } = PostsStore.getState();

        return html`
          <button @click=${() => PostsStore.query("posts:fetch")}>Refetch Posts</button>
          ${this.renderPosts(posts)}
        `;
      }

      renderPosts(posts) {
        if (posts.status === "pending") {
          return html`<div>Loading...</div>`;
        }

        if (posts.status === "error") {
          return html`<div>Error: ${posts.error}</div>`;
        }

        return html`
          <ul>
            ${posts.data.map(post => html`
              <li><h3>${post.title}</h3></li>
            `)}
          </ul>
        `;
      }
    }
    ```

### Query Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `queryKey` | `string \| string[] \| (args) => string[]` | Required | Unique cache key |
| `queryFn` | `(args) => Promise` | Required | Function to fetch data |
| `staleTime` | `number` | `0` | Time in ms before data is considered stale |
| `gcTime` | `number` | `300000` | Time in ms before unused cache is garbage collected |
| `retry` | `number` | `1` | Number of retry attempts |
| `retryDelay` | `number \| (attempt) => number` | `1000` | Delay between retries |
| `refetchOnWindowFocus` | `boolean` | `false` | Refetch when window gains focus |
| `refetchOnReconnect` | `boolean` | `true` | Refetch when network reconnects |
| `refetchInterval` | `number \| null` | `null` | Polling interval in ms |

---

## Mutations

Mutations are used to modify server-side data. They support optimistic updates and rollback on error.

### Setting Up a Mutation

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Add mutation state to the store
    const PostsStore = store({
      name: "PostsStore",
      state: {
        posts: { status: "idle", data: [], error: null },
        addPost: { status: "idle", error: null },
      },
    });

    // Action to handle add post status
    PostsStore.defineAction("addPost:setPending", ({ state }) => {
      state.addPost.status = "pending";
      state.addPost.error = null;
    });

    PostsStore.defineAction("addPost:setSuccess", ({ state }) => {
      state.addPost.status = "success";
    });

    PostsStore.defineAction("addPost:setError", ({ state, payload }) => {
      state.addPost.status = "error";
      state.addPost.error = payload.message || String(payload);
    });

    PostsStore.defineAction("addPost:reset", ({ state }) => {
      state.addPost = { status: "idle", error: null };
    });

    // Define the mutation
    PostsStore.defineMutation("posts:create", {
      mutationFn: (newPost) => {
        return fetch("https://cami-api.exe.xyz/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: { "Content-Type": "application/json" },
        }).then(r => r.json());
      },
      onMutate: ({ dispatch }) => {
        dispatch("addPost:setPending");
      },
      onSuccess: ({ dispatch, invalidateQueries }) => {
        dispatch("addPost:setSuccess");
        // Refetch posts to get the new one
        invalidateQueries({ queryKey: ["posts"] });
      },
      onError: ({ error, dispatch }) => {
        dispatch("addPost:setError", error);
      },
    });
    ```

=== "TypeScript"

    ```typescript
    type AddPostStatus = "idle" | "pending" | "success" | "error";

    interface NewPost {
      title: string;
      body: string;
    }

    interface MutationState {
      posts: { status: RequestStatus; data: Post[]; error: string | null };
      addPost: { status: AddPostStatus; error: string | null };
    }

    // Add mutation state to the store
    const PostsStore = store<MutationState>({
      name: "PostsStore",
      state: {
        posts: { status: "idle", data: [], error: null },
        addPost: { status: "idle", error: null },
      },
    });

    // Action to handle add post status
    PostsStore.defineAction("addPost:setPending", ({ state }) => {
      state.addPost.status = "pending";
      state.addPost.error = null;
    });

    PostsStore.defineAction("addPost:setSuccess", ({ state }) => {
      state.addPost.status = "success";
    });

    PostsStore.defineAction("addPost:setError", ({ state, payload }) => {
      state.addPost.status = "error";
      state.addPost.error = payload instanceof Error ? payload.message : String(payload);
    });

    PostsStore.defineAction("addPost:reset", ({ state }) => {
      state.addPost = { status: "idle", error: null };
    });

    // Define the mutation
    PostsStore.defineMutation<NewPost, Post>("posts:create", {
      mutationFn: async (newPost: NewPost): Promise<Post> => {
        const response = await fetch("https://cami-api.exe.xyz/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: { "Content-Type": "application/json" },
        });
        return await response.json() as Post;
      },
      onMutate: ({ dispatch }) => {
        dispatch("addPost:setPending");
      },
      onSuccess: ({ dispatch, invalidateQueries }) => {
        dispatch("addPost:setSuccess");
        // Refetch posts to get the new one
        invalidateQueries({ queryKey: ["posts"] });
      },
      onError: ({ error, dispatch }) => {
        dispatch("addPost:setError", error);
      },
    });
    ```

### Using Mutations in Components

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class AddPostForm extends ReactiveElement {
      template() {
        const { addPost } = PostsStore.getState();

        if (addPost.status === "pending") {
          return html`<div>Adding post...</div>`;
        }

        if (addPost.status === "error") {
          return html`
            <div>Error: ${addPost.error}</div>
            <button @click=${() => PostsStore.dispatch("addPost:reset")}>Try Again</button>
          `;
        }

        if (addPost.status === "success") {
          return html`
            <div>Post added successfully!</div>
            <button @click=${() => PostsStore.dispatch("addPost:reset")}>Add Another</button>
          `;
        }

        return html`
          <form @submit=${this.handleSubmit}>
            <input type="text" name="title" placeholder="Post Title" required />
            <textarea name="body" placeholder="Post Body" required></textarea>
            <button type="submit">Add Post</button>
          </form>
        `;
      }

      handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const title = form.elements.title.value;
        const body = form.elements.body.value;

        PostsStore.mutate("posts:create", { title, body });
      }
    }

    customElements.define('add-post-form', AddPostForm);
    ```

=== "TypeScript"

    ```typescript
    class AddPostForm extends ReactiveElement {
      template(): ReturnType<typeof html> {
        const { addPost } = PostsStore.getState();

        if (addPost.status === "pending") {
          return html`<div>Adding post...</div>`;
        }

        if (addPost.status === "error") {
          return html`
            <div>Error: ${addPost.error}</div>
            <button @click=${() => PostsStore.dispatch("addPost:reset")}>Try Again</button>
          `;
        }

        if (addPost.status === "success") {
          return html`
            <div>Post added successfully!</div>
            <button @click=${() => PostsStore.dispatch("addPost:reset")}>Add Another</button>
          `;
        }

        return html`
          <form @submit=${this.handleSubmit}>
            <input type="text" name="title" placeholder="Post Title" required />
            <textarea name="body" placeholder="Post Body" required></textarea>
            <button type="submit">Add Post</button>
          </form>
        `;
      }

      handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const title = String(data.get("title") ?? "");
        const body = String(data.get("body") ?? "");

        void PostsStore.mutate<Post>("posts:create", { title, body } satisfies NewPost);
      }
    }

    customElements.define('add-post-form', AddPostForm);
    ```

### Optimistic Updates with Rollback

For a smoother UX, update the UI immediately and rollback on error:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    PostsStore.defineMutation("posts:delete", {
      mutationFn: (postId) => {
        return fetch(`https://cami-api.exe.xyz/posts/${postId}`, {
          method: "DELETE",
        });
      },
      onMutate: ({ state, payload, dispatch }) => {
        // Optimistically remove the post
        // Note: previousState is automatically captured before onMutate runs
        dispatch("posts:setSuccess", state.posts.data.filter(p => p.id !== payload));
      },
      onError: ({ error, dispatch, previousState }) => {
        // Rollback using previousState (automatically captured before mutation)
        dispatch("posts:setSuccess", previousState.posts.data);
        console.error("Delete failed:", error);
      },
      onSuccess: ({ invalidateQueries }) => {
        // Optionally refetch to ensure consistency
        invalidateQueries({ queryKey: ["posts"] });
      },
    });
    ```

=== "TypeScript"

    ```typescript
    PostsStore.defineMutation<number, Response>("posts:delete", {
      mutationFn: (postId: number): Promise<Response> => {
        return fetch(`https://cami-api.exe.xyz/posts/${postId}`, {
          method: "DELETE",
        });
      },
      onMutate: ({ state, payload, dispatch }) => {
        // Optimistically remove the post
        // Note: previousState is automatically captured before onMutate runs
        dispatch("posts:setSuccess", state.posts.data.filter((post: Post) => post.id !== payload));
      },
      onError: ({ error, dispatch, previousState }) => {
        // Rollback using previousState (automatically captured before mutation)
        dispatch("posts:setSuccess", (previousState as PostsState).posts.data);
        console.error("Delete failed:", error);
      },
      onSuccess: ({ invalidateQueries }) => {
        // Optionally refetch to ensure consistency
        invalidateQueries({ queryKey: ["posts"] });
      },
    });
    ```

### Mutation Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `mutationFn` | `(args) => Promise` | Function to perform the mutation |
| `onMutate` | `(context) => any` | Called before mutation (for optimistic updates) |
| `onSuccess` | `(context) => void` | Called on success |
| `onError` | `(context) => void` | Called on error |
| `onSettled` | `(context) => void` | Called after success or error |

---

## Complete Example

Here's a full working example with queries and mutations:

```html
<blog-component></blog-component>

<script src="https://unpkg.com/cami@0.4.1/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

### Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/blog.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/blog.ts"
    ```

## Best Practices

1. **Model request state explicitly**: Use a shape like `{ status, data, error }` for each async operation.

2. **Use actions for state updates**: Query/mutation callbacks should dispatch actions, not mutate state directly.

3. **Use `staleTime` wisely**: Set appropriate stale times to avoid unnecessary refetches.

4. **Invalidate queries after mutations**: Use `invalidateQueries()` in `onSuccess` to refetch related data.

5. **Handle all states**: Always render pending, error, and success states.

See the [ObservableStore API](../api/observable_store.md) for full documentation.
