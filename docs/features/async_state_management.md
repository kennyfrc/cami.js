Cami provides a powerful async state management system that allows components to fetch and manage asynchronous data with ease. Here's how it works:

### Queries

Queries are used to fetch data asynchronously and serve it to your components. They are defined with a `queryKey`, a unique identifier for the query's data in the internal cache, and a `queryFn`, a function that fetches the data. The result of a query is an observable object that automatically updates its `data`, `status`, and `error` keys based on the query's execution, allowing you to declaratively render UI based on the state of the asynchronous operation.

Here's an example of defining a query in a component and using it to render UI:

```javascript
posts = this.query({
  queryKey: ["posts"],
  queryFn: () => fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json()),
  staleTime: 1000 * 60 * 5 // Optional: data is considered fresh for 5 minutes
});

template() {
  if (this.posts.status === "loading") {
    return html`<div>Loading...</div>`;
  }

  if (this.posts.status === "error") {
    return html`<div>Error: ${this.posts.error.message}</div>`;
  }

  if (this.posts.data) {
    return html`
      <ul>
        ${this.posts.data.map(post => html`
          <li>
            <h2>${post.title}</h2>
            <p>${post.body}</p>
          </li>
        `)}
      </ul>
    `;
  }
}
```

Queries automatically refetch data to prevent it from becoming stale. However, you can control this behavior with the `staleTime` parameter, which defines how long the data should remain fresh before a refetch is required. The observable object returned by the query allows for a reactive connection between the data and the component's template, enabling the UI to update automatically when the query's state changes.

When a component is added to the DOM, we can start fetching data by using the `onConnect()` method. This method is similar to the `connectedCallback()` used in Web Components, which you can read more about on [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks). Inside `onConnect()`, we call a function like `fetchPosts()` to load our data.

For displaying the data, we can create a separate method like `renderPosts()` and call it inside our `template()` method. This helps us keep our code organized and makes it easier to manage different parts of our component.

Here's how you can structure the component:

```javascript
class BlogPostsElement extends ReactiveElement {
  posts = {}

  onConnect() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.posts = this.query({
      queryKey: ['posts', { limit }],
      queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5`).then(res => res.json())
    });
  }

  template() {
    return html`
      <button @click=${() => this.fetchPosts()}>Refetch Posts</button>
      ${this.renderPosts()}
    `;
  }

  renderPosts() {
    if (this.posts.status === "loading") {
      return html`<div class="md-loader">Loading...</div>`;
    }

    if (this.posts.status === "error") {
      return html`<div class="md-error">Error: ${this.posts.error.message}</div>`;
    }

    if (this.posts.data) {
      return html`
        <div class="md-card">
          <ul class="md-list">
            ${this.posts.data.map(post => html`
              <li class="md-list-item">
                <h5 class="md-title">${post.title}</h5>
                <p class="md-body-1">${post.body}</p>
              </li>
            `)}
          </ul>
        </div>
      `;
    }
  }
}
```

This way, the `onConnect()` method is used to start the data fetching process, and the `renderPosts()` method is used to handle the display of the posts, keeping the code clean and easy to understand.

#### Live Demo of Async State Management (Blog Posts - Query)

Below is a live demo of the component in action. The only change is that we're fetching a random number of posts between 1 and 5 just so you can see states change.

<hr>

<article>
  <h5>Blog Posts Component</h5>
  <p><small class="note">The data fetches a random number of posts between 1 and 5 just so you can see states change.</small></p>
  <blog-posts-query-example></blog-posts-query-example>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class BlogPostsElement extends ReactiveElement {
    posts = {} // you'd want to define this to make it an observable object

    onConnect() {
      this.fetchPosts();
    }

    fetchPosts() {
      const limit = Math.floor(Math.random() * 5) + 1; // Generate a random limit between 1 and 5
      this.posts = this.query({
        queryKey: ['posts', { limit }],
        queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`).then(res => res.json()),
        staleTime: 0
      });
    }

    template() {
      return html`
        <button class="md-button md-button--primary"
        @click=${() => this.fetchPosts()}>Refetch Posts</button>
        ${this.renderPosts()}
      `;
    }

    renderPosts() {
      if (this.posts.status === "loading") {
        return html`<div class="md-loader">Loading...</div>`;
      }

      if (this.posts.status === "error") {
        return html`<div class="md-error">Error: ${this.posts.error.message}</div>`;
      }

      if (this.posts.data) {
        return html`
          <div class="md-card">
            <ul class="md-list">
              ${this.posts.data.map(post => html`
                <li class="md-list-item">
                  <h5 class="md-title">${post.title}</h5>
                  <p class="md-body-1">${post.body}</p>
                </li>
              `)}
            </ul>
          </div>
        `;
      }
    }
  }

  customElements.define('blog-posts-query-example', BlogPostsElement);
</script>

<hr>

### Mutations

Mutations are used to modify server-side data and reflect those changes in the UI. They are defined with a `mutationFn`, which performs the update.

Here's an example of defining a mutation in a component:

```javascript
addPost = this.mutation({
  mutationFn: (newPost) => fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(res => res.json())
});
```

This mutation submits a POST request to the server, and the component's UI can declaratively show various loading and error states. For example, you can display a loading message while the request is pending and an error message if the request fails, as shown below:

```javascript
if (this.addPost.status === "pending") {
  return html`
    <div>Adding post...</div>
  `;
}

if (this.addPost.status === "error") {
  return html`<div>Error: ${this.addPost.error.message}</div>`;
}
```

By using mutations, Cami enables developers to handle server-side updates in a consistent and powerful way, similar to how queries are used for fetching data.

#### Live Demo of Async State Management (Blog Posts - With Mutations)

This live demo includes a form to submit a new post, which uses a mutation to update the server-side data. The mutation is defined in the `BlogPostsElement` class, and it handles the post submission process. The UI reflects the state of the mutation, showing a loading message while the request is pending and an error message if the request fails.

<hr>

<article>
  <h5>Blog Posts Component</h5>
  <p><small class="note">The data fetches a random number of posts between 1 and 5 just so you can see states change.</small></p>
  <blog-posts-mutation-example></blog-posts-mutation-example>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class BlogPostsElement extends ReactiveElement {
    posts = {}

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
    });

    onConnect() {
      this.fetchPosts();
    }

    fetchPosts() {
      const limit = Math.floor(Math.random() * 5) + 1; // Generate a random limit between 1 and 5
      this.posts = this.query({
        queryKey: ['posts', { limit }],
        queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`).then(res => res.json()),
        staleTime: 0
      });
    }

    template() {
      if (this.addPost.status === "pending") {
        return html`
          <div>Adding post...</div>
        `;
      }

      if (this.addPost.status === "error") {
        return html`<div>Error: ${this.addPost.error.message}</div>`;
      }

      if (this.addPost.status === "success") {
        return html`<div>Post added successfully! Note that we're using a Mock API, so the post won't actually be added.</div><button class="md-button md-button--primary"
        @click=${() => this.addPost.reset()}>Reset</button>`;
      }

      return html`
        <input type="text" name="title" placeholder="Post Title">
        <input type="text" name="body" placeholder="Post Body">
        <button class="md-button md-button--primary"
        @click=${() => this.addPost.mutate({ title: document.querySelector('input[name="title"]').value, body: document.querySelector('input[name="body"]').value })}>Add Post</button>
        <button class="md-button md-button--primary"
        @click=${() => this.fetchPosts()}>Refetch Posts</button>
        ${this.renderPosts()}
      `;
    }

    renderPosts() {
      if (this.posts.status === "loading") {
        return html`<div class="md-loader">Loading...</div>`;
      }

      if (this.posts.status === "error") {
        return html`<div class="md-error">Error: ${this.posts.error.message}</div>`;
      }

      if (this.posts.data) {
        return html`
          <div class="md-card">
            <ul class="md-list">
              ${this.posts.data.map(post => html`
                <li class="md-list-item">
                  <h5 class="md-title">${post.title}</h5>
                  <p class="md-body-1">${post.body}</p>
                </li>
              `)}
            </ul>
          </div>
        `;
      }
    }
  }

  customElements.define('blog-posts-mutation-example', BlogPostsElement);
</script>

<hr>
