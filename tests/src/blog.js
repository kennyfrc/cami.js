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
      state.loading = false;
    },
    setError: ({ state, payload }) => {
      state.error = payload;
      state.loading = false;
    },
    pushPost: ({ state, payload }) => {
      state.posts.push(payload);
    }
  },
  queries: {
    fetchPosts: {
      queryKey: ['posts'],
      queryFn: () => fetch("https://api.camijs.com/posts").then(res => res.json()),
      onSuccess: ({ dispatch, data }) => {
        dispatch('setPosts', data);
      },
      onError: ({ dispatch, data }) => {
        dispatch('setError', data.message);
      }
    }
  },
  mutations: {
    createPost: {
      mutationFn: (payload) => {
        return fetch("https://api.camijs.com/posts", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => res.json());
      },
      onMutate: ({ dispatch, payload }) => {
        const post = { ...payload, id: Date.now() };
        dispatch('pushPost', post);
      },
      onSuccess: ({ invalidateQueries }) => {
        invalidateQueries({ queryKey: 'fetchPosts' });
      },
      onError: ({ dispatch, previousState }) => {
        dispatch('setPosts', previousState.posts);
      }
    }
  }
});

class BlogComponent extends ReactiveElement {
  template() {
    const { loading, error, posts } = BlogModel;

    if (loading) return html`<p>Loading...</p>`;
    if (error) return html`<p>Error: ${error}</p>`;

    return html`
      <ul>
        ${posts.map(post => html`<li>${post.title}</li>`)}
      </ul>
    `;
  }
}

customElements.define('blog-component', BlogComponent);

export default BlogComponent;
