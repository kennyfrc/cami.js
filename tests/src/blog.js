const { ReactiveElement, slice, html } = cami;

export const BlogSlice = slice("BlogSlice", {
  store: "blog-store",
  state: {
    posts: [],
    loading: false,
    error: null
  },
  actions: {
    setPosts: ({ state, payload }) => {
      state.posts = payload;
    },
    setLoading: ({ state, payload }) => {
      state.loading = payload;
    },
    setError: ({ state, payload }) => {
      state.error = payload;
    }
  },
  queries: {
    fetchPosts: {
      queryKey: ['posts'],
      queryFn: () => fetch("https://api.camijs.com/posts").then(res => res.json()),
      onSuccess: (ctx) => {
        ctx.actions.setPosts(ctx.response);
      },
      onError: (ctx) => {
        ctx.actions.setError(ctx.error.message);
      }
    }
  },
  mutations: {
    addPost: {
      mutationFn: (newPost) => {
        return fetch("https://api.camijs.com/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => res.json());
      },
      onMutate: (ctx) => {
        const optimisticPost = { ...ctx.args[0], id: Date.now() };
        ctx.actions.setPosts([...ctx.state.posts, optimisticPost]);
      },
      onSuccess: (ctx) => {
        ctx.invalidateQueries({ queryKey: ['posts'] });
      },
      onError: (ctx) => {
        ctx.actions.setError(ctx.error.message);
      }
    }
  }
});

class BlogComponent extends ReactiveElement {
  constructor() {
    super();
    this.posts = BlogSlice.fetchPosts();
  }

  addPost = BlogSlice.addPost;

  template() {
    if (BlogSlice.loading) return html`<p>Loading...</p>`;
    if (BlogSlice.error) return html`<p>Error: ${BlogSlice.error}</p>`;

    return html`
      <ul>
        ${BlogSlice.posts.map(post => html`<li>${post.title}</li>`)}
      </ul>
    `;
  }
}

customElements.define('blog-component', BlogComponent);

export default BlogComponent;
