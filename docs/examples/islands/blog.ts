import { html, ReactiveElement, store } from 'cami'

type RequestStatus = 'idle' | 'pending' | 'success' | 'error'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface NewPost {
  title: string
  body: string
  userId: number
}

interface BlogState {
  posts: { status: RequestStatus; data: Post[]; error: string | null }
  addPost: { status: RequestStatus; error: string | null }
}

const BlogStore = store<BlogState>({
  name: 'BlogStore',
  state: {
    posts: { status: 'idle', data: [], error: null },
    addPost: { status: 'idle', error: null },
  },
})

BlogStore.defineAction('posts:setPending', ({ state }) => {
  state.posts.status = 'pending'
  state.posts.error = null
})

BlogStore.defineAction('posts:setSuccess', ({ state, payload }) => {
  state.posts = { status: 'success', data: payload as Post[], error: null }
})

BlogStore.defineAction('posts:setError', ({ state, payload }) => {
  state.posts.status = 'error'
  state.posts.error = payload instanceof Error ? payload.message : String(payload)
})

BlogStore.defineAction('posts:addOptimistic', ({ state, payload }) => {
  const post = payload as NewPost
  state.posts.data.push({ ...post, id: Date.now() })
})

BlogStore.defineAction('addPost:setStatus', ({ state, payload }) => {
  state.addPost = payload as BlogState['addPost']
})

BlogStore.defineQuery<void, Post[]>('posts:fetch', {
  queryKey: ['posts'],
  queryFn: async (): Promise<Post[]> => {
    const response = await fetch('https://cami-api.exe.xyz/posts?_limit=5')
    if (!response.ok) throw new Error(`Posts request failed: ${response.status}`)
    return await response.json() as Post[]
  },
  staleTime: 5 * 60_000,
  onFetch: ({ dispatch }) => dispatch('posts:setPending'),
  onSuccess: ({ data, dispatch }) => dispatch('posts:setSuccess', data),
  onError: ({ error, dispatch }) => dispatch('posts:setError', error),
})

BlogStore.defineMutation<NewPost, Post>('posts:create', {
  mutationFn: async (newPost: NewPost): Promise<Post> => {
    const response = await fetch('https://cami-api.exe.xyz/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error(`Create request failed: ${response.status}`)
    return await response.json() as Post
  },
  onMutate: ({ payload, dispatch }) => {
    dispatch('addPost:setStatus', { status: 'pending', error: null })
    dispatch('posts:addOptimistic', payload)
  },
  onError: ({ error, dispatch, previousState }) => {
    dispatch('posts:setSuccess', (previousState as BlogState).posts.data)
    dispatch('addPost:setStatus', { status: 'error', error: error.message })
  },
  onSuccess: ({ dispatch }) => dispatch('addPost:setStatus', { status: 'success', error: null }),
  onSettled: ({ invalidateQueries }) => invalidateQueries({ queryKey: ['posts'] }),
})

void BlogStore.query<Post[]>('posts:fetch')

class BlogComponent extends ReactiveElement {
  handleAddPost(): void {
    void BlogStore.mutate<Post>('posts:create', {
      title: 'New Post, Made Optimistically',
      body: 'This post appears before the mock API responds.',
      userId: 1,
    } satisfies NewPost)
  }

  template(): ReturnType<typeof html> {
    const { posts, addPost } = BlogStore.getState()
    if (addPost.status === 'pending') return html`<p>Adding post…</p>`
    if (posts.status === 'pending') return html`<p>Loading…</p>`
    if (posts.error) return html`<p role="alert">${posts.error}</p>`

    return html`
      <button @click=${() => this.handleAddPost()}>Add Post</button>
      <ul>
        ${posts.data.slice().reverse().map((post: Post) => html`
          <li><h2>${post.title}</h2><p>${post.body}</p></li>
        `)}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'blog-component': BlogComponent
  }
}

customElements.define('blog-component', BlogComponent)
