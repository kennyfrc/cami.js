const { html, ReactiveElement, store } = cami
const BlogStore = store({
    name: 'BlogStore',
    state: {
        posts: { status: 'idle', data: [], error: null },
        addPost: { status: 'idle', error: null },
    },
});
BlogStore.defineAction('posts:setPending', ({ state }) => {
    state.posts.status = 'pending';
    state.posts.error = null;
});
BlogStore.defineAction('posts:setSuccess', ({ state, payload }) => {
    state.posts = { status: 'success', data: payload, error: null };
});
BlogStore.defineAction('posts:setError', ({ state, payload }) => {
    state.posts.status = 'error';
    state.posts.error = payload instanceof Error ? payload.message : String(payload);
});
BlogStore.defineAction('posts:addOptimistic', ({ state, payload }) => {
    const post = payload;
    state.posts.data.push({ ...post, id: Date.now() });
});
BlogStore.defineAction('addPost:setStatus', ({ state, payload }) => {
    state.addPost = payload;
});
BlogStore.defineQuery('posts:fetch', {
    queryKey: ['posts'],
    queryFn: async () => {
        const response = await fetch('https://cami-api.exe.xyz/posts?_limit=5');
        if (!response.ok)
            throw new Error(`Posts request failed: ${response.status}`);
        return await response.json();
    },
    staleTime: 5 * 60_000,
    onFetch: ({ dispatch }) => dispatch('posts:setPending'),
    onSuccess: ({ data, dispatch }) => dispatch('posts:setSuccess', data),
    onError: ({ error, dispatch }) => dispatch('posts:setError', error),
});
BlogStore.defineMutation('posts:create', {
    mutationFn: async (newPost) => {
        const response = await fetch('https://cami-api.exe.xyz/posts', {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
            throw new Error(`Create request failed: ${response.status}`);
        return await response.json();
    },
    onMutate: ({ payload, dispatch }) => {
        dispatch('addPost:setStatus', { status: 'pending', error: null });
        dispatch('posts:addOptimistic', payload);
    },
    onError: ({ error, dispatch, previousState }) => {
        dispatch('posts:setSuccess', previousState.posts.data);
        dispatch('addPost:setStatus', { status: 'error', error: error.message });
    },
    onSuccess: ({ dispatch }) => dispatch('addPost:setStatus', { status: 'success', error: null }),
    onSettled: ({ invalidateQueries }) => invalidateQueries({ queryKey: ['posts'] }),
});
void BlogStore.query('posts:fetch');
class BlogComponent extends ReactiveElement {
    handleAddPost() {
        void BlogStore.mutate('posts:create', {
            title: 'New Post, Made Optimistically',
            body: 'This post appears before the mock API responds.',
            userId: 1,
        });
    }
    template() {
        const { posts, addPost } = BlogStore.getState();
        if (addPost.status === 'pending')
            return html `<p>Adding post…</p>`;
        if (posts.status === 'pending')
            return html `<p>Loading…</p>`;
        if (posts.error)
            return html `<p role="alert">${posts.error}</p>`;
        return html `
      <button @click=${() => this.handleAddPost()}>Add Post</button>
      <ul>
        ${posts.data.slice().reverse().map((post) => html `
          <li><h2>${post.title}</h2><p>${post.body}</p></li>
        `)}
      </ul>
    `;
    }
}
customElements.define('blog-component', BlogComponent);
