const { ReactiveElement, model, html } = cami;

export const BlogModel = model("BlogModel", {
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
    },
    pushPost: ({ state, payload }) => {
      state.posts = [...state.posts, payload];
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
      onMutate: ({ state, payload, actions }) => {
        const post = { ...payload, id: Date.now() };
        actions.pushPost(post);
      },
      onSuccess: (ctx) => {
        ctx.invalidateQueries({ queryKey: ['posts'] });
      },
      onError: ({ previousState, actions }) => {
        actions.setPosts(previousState.posts);
      }
    }
  }
});

class BlogComponent extends ReactiveElement {
  constructor() {
    super();
    this.posts = BlogModel.fetchPosts();
  }

  addPost = BlogModel.addPost;

  template() {
    if (BlogModel.loading) return html`<p>Loading...</p>`;
    if (BlogModel.error) return html`<p>Error: ${BlogModel.error}</p>`;

    return html`
      <ul>
        ${BlogModel.posts.map(post => html`<li>${post.title}</li>`)}
      </ul>
    `;
  }
}

customElements.define('blog-component', BlogComponent);

export default BlogComponent;
