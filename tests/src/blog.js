const { ReactiveElement, store, html } = cami

const blogStore = store({
  state: {
    posts: [],
    loading: false,
    error: null,
  },
  name: 'blog-store',
})

blogStore.defineAction('setPosts', ({ state, payload }) => {
  state.posts = payload
  state.loading = false
})

blogStore.defineAction('setError', ({ state, payload }) => {
  state.error = payload
  state.loading = false
})

blogStore.defineAction('pushPost', ({ state, payload }) => {
  state.posts.push(payload)
})

blogStore.defineQuery('fetchPosts', {
  queryKey: ['posts'],
  queryFn: () => fetch('https://cami-api.exe.xyz/posts').then(res => res.json()),
  onSuccess: ({ dispatch, data }) => {
    dispatch('setPosts', data)
  },
  onError: ({ dispatch, data }) => {
    dispatch('setError', data.message)
  },
})

blogStore.defineMutation('createPost', {
  mutationFn: payload => {
    return fetch('https://cami-api.exe.xyz/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(res => res.json())
  },
  onMutate: ({ dispatch, payload }) => {
    const post = { ...payload, id: Date.now() }
    dispatch('pushPost', post)
  },
  onSuccess: ({ invalidateQueries }) => {
    invalidateQueries({ queryKey: ['posts'] })
  },
  onError: ({ dispatch, previousState }) => {
    dispatch('setPosts', previousState.posts)
  },
})

customElements.define(
  'blog-component',
  class extends ReactiveElement {
    template() {
      const { loading, error, posts } = blogStore.state
      const { mutate } = blogStore

      if (loading)
        return html`
          <p>Loading...</p>
        `
      if (error) return html`<p>Error: ${error}</p>`

      return html`
                <ul>
                    ${posts.map(post => html`<li>${post.title}</li>`)}
                </ul>
                <button
                    @click=${() =>
                      mutate('createPost', {
                        title: 'New Post',
                        content: 'Content',
                      })}
                >
                    Add New Post
                </button>
            `
    }
  }
)

export { blogStore }
