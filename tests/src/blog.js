const { html, ReactiveElement, http } = cami;

class BlogComponent extends ReactiveElement {
  posts = this.query({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch("https://api.camijs.com/posts?_limit=5")
        .then(res => res.json())
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  //
  // This uses optimistic UI. To disable optimistic UI, remove the onMutate and onError handlers.
  //
  addPost = this.mutation({
    mutationFn: (newPost) => {
      return fetch("https://api.camijs.com/posts", {
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
      <div>Adding post...</div>`;
    }

    if (this.addPost.status === "error") {
      return html`<div>Error: ${this.addPost.error.message}</div>`;
    }

    if (this.posts.data) {
      return html`
        <button @click=${() => this.addPost.mutate({
          title: "New Post, Made Optimistically",
          body: "This is a new post created with optimistic UI. I actually won't persist to the server though. So upon refresh, I will rollback (either through window change, refresh, or after stale time of 5 minutes)",
          userId: 1
        })}>Add Post</button>
        <ul>
          ${this.posts.data.slice().reverse().map(post => html`
            <li>
              <h2>${post.title}</h2>
              <p>${post.body}</p>
            </li>
          `)}
        </ul>
      `;
    }

    if (this.posts.status === "loading") {
      return html`<div>Loading...</div>`;
    }

    if (this.posts.status === "error") {
      return html`<div>Error: ${this.posts.error.message}</div>`;
    }
  }
}

customElements.define('blog-component', BlogComponent);

export default BlogComponent;
