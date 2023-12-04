# Blog with Optimistic UI

Our query can also do optimistic UI if:

- In the `onMutate` callback definition, you snapshot the previous state, optimistically update to the new value, and return a rollback function.

<hr>

<article>
  <blog-component-be></blog-component-be>
</article>
<script type="module">
  const { html, ReactiveElement, http } = cami;

  class BlogComponent extends ReactiveElement {
    posts = this.query({
      queryKey: ["posts"],
      queryFn: () => {
        return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
          .then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    })

    //
    // This uses optimistic UI. To disable optimistic UI, remove the onMutate and onError handlers.
    //
    addPost = this.mutation({
      mutationFn: (newPost) => {
        return fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => res.json())
      },
      onMutate: (newPost) => {
        // Snapshot the previous state
        const previousPosts = this.posts.data;

        // Optimistically update to the new value
        this.posts.update(state => {
          state.data.push({ ...newPost, id: Date.now() });
        });

        // Return the rollback function and the new post
        return {
          rollback: () => {
            this.posts.update(state => {
              state.data = previousPosts;
            });
          },
          optimisticPost: newPost
        };
      },
      onError: (error, newPost, context) => {
        // Rollback to the previous state
        if (context.rollback) {
          context.rollback();
        }
      },
      onSettled: () => {
        // Invalidate the posts query to refetch the true state
        if (!this.addPost.isSettled) {
          this.invalidateQueries(['posts']);
        }
      }
    });

    template() {
      if (this.addPost.status === "pending") {
        return html`
        <div class="md-loading">Adding post...</div>`;
      }

      if (this.addPost.status === "error") {
        return html`<div class="md-error">Error: ${this.addPost.error.message}</div>`;
      }

      if (this.posts.data) {
        return html`
          <h3>Blog Posts</h3>
          <button class="md-button" @click=${() => this.addPost.mutate({
            title: "New Post, Made Optimistically",
            body: "This is a new post created with optimistic UI. I actually won't persist to the server though. So upon refresh, I will rollback (either through window change, refresh, or after stale time of 5 minutes)",
            userId: 1
          })}>Add Post</button>
          <ul class="md-list">
            ${this.posts.data.slice().reverse().map(post => html`
              <li class="md-list-item">
                <h2 class="md-title">${post.title}</h2>
                <p class="md-body">${post.body}</p>
              </li>
            `)}
          </ul>
        `;
      }

      if (this.posts.status === "loading") {
        return html`<div class="md-loading">Loading...</div>`;
      }

      if (this.posts.status === "error") {
        return html`<div class="md-error">Error: ${this.posts.error.message}</div>`;
      }
    }
  }


  customElements.define('blog-component-be', BlogComponent);
</script>

## JS Fiddle:

[https://jsfiddle.net/kennyfrc12/69ceahtw/](https://jsfiddle.net/kennyfrc12/69ceahtw/)

## HTML:

```html
<article>
  <blog-component-be></blog-component-be>
</article>
<script type="module">
  const { html, ReactiveElement, http } = cami;

  class BlogComponent extends ReactiveElement {
    posts = this.query({
      queryKey: ["posts"],
      queryFn: () => {
        return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
          .then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    })

    //
    // This uses optimistic UI. To disable optimistic UI, remove the onMutate and onError handlers.
    //
    addPost = this.mutation({
      mutationFn: (newPost) => {
        return fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => res.json())
      },
      onMutate: (newPost) => {
        // Snapshot the previous state
        const previousPosts = this.posts.data;

        // Optimistically update to the new value
        this.posts.update(state => {
          state.data.push({ ...newPost, id: Date.now() });
        });

        // Return the rollback function and the new post
        return {
          rollback: () => {
            this.posts.update(state => {
              state.data = previousPosts;
            });
          },
          optimisticPost: newPost
        };
      },
      onError: (error, newPost, context) => {
        // Rollback to the previous state
        if (context.rollback) {
          context.rollback();
        }
      },
      onSettled: () => {
        // Invalidate the posts query to refetch the true state
        if (!this.addPost.isSettled) {
          this.invalidateQueries(['posts']);
        }
      }
    });

    template() {
      if (this.addPost.status === "pending") {
        return html`
        <div class="md-loading">Adding post...</div>`;
      }

      if (this.addPost.status === "error") {
        return html`<div class="md-error">Error: ${this.addPost.error.message}</div>`;
      }

      if (this.posts.data) {
        return html`
          <button class="md-button" @click=${() => this.addPost.mutate({
            title: "New Post, Made Optimistically",
            body: "This is a new post created with optimistic UI. I actually won't persist to the server though. So upon refresh, I will rollback (either through window change, refresh, or after stale time of 5 minutes)",
            userId: 1
          })}>Add Post</button>
          <ul class="md-list">
            ${this.posts.data.slice().reverse().map(post => html`
              <li class="md-list-item">
                <h2 class="md-title">${post.title}</h2>
                <p class="md-body">${post.body}</p>
              </li>
            `)}
          </ul>
        `;
      }

      if (this.posts.status === "loading") {
        return html`<div class="md-loading">Loading...</div>`;
      }

      if (this.posts.status === "error") {
        return html`<div class="md-error">Error: ${this.posts.error.message}</div>`;
      }
    }
  }


  customElements.define('blog-component-be', BlogComponent);
</script>

```
