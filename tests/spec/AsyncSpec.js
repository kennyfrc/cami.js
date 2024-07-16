const { store } = cami;

const userStore = store({
  state: {
    user: null,
    posts: [],
    latestPostComments: [],
    loading: false,
    error: null
  },
  name: "user-store-test"
});

userStore.defineAction('setUser', ({ state, payload }) => {
  state.user = payload;
});

userStore.defineAction('setPosts', ({ state, payload }) => {
  state.posts = payload ? payload : [];
});

userStore.defineAction('setLatestPostComments', ({ state, payload }) => {
  state.latestPostComments = payload;
});

userStore.defineAction('setLoading', ({ state, payload }) => {
  state.loading = payload;
});

userStore.defineAction('setError', ({ state, payload }) => {
  state.error = payload;
});

describe('Async Actions - Thunks', () => {
  it('should define and dispatch a simple thunk', async () => {
    userStore.defineThunk('simpleThunk', async ({ dispatch }) => {
      dispatch('setLoading', true);
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch('setUser', { id: 1, name: 'John Doe' });
      dispatch('setLoading', false);
    });

    await userStore.dispatchAsync('simpleThunk');

    expect(userStore.state.loading).toBe(false);
    expect(userStore.state.user).toEqual({ id: 1, name: 'John Doe' });
  });

  it('should handle errors in thunks', async () => {
    userStore.defineThunk('errorThunk', async ({ dispatch }) => {
      dispatch('setLoading', true);
      try {
        throw new Error('Test error');
      } catch (error) {
        dispatch('setError', error.message);
      } finally {
        dispatch('setLoading', false);
      }
    });

    await userStore.dispatchAsync('errorThunk');

    expect(userStore.state.loading).toBe(false);
    expect(userStore.state.error).toBe('Test error');
  });

  it('should handle thunks with parameters', async () => {
    userStore.defineThunk('fetchUser', async ({ dispatch, payload }) => {
      dispatch('setLoading', true);
      const userId = payload;
      const user = { id: userId, name: `User ${userId}` };
      dispatch('setUser', user);
      dispatch('setLoading', false);
      return user;
    });

    const result = await userStore.dispatchAsync('fetchUser', 5);

    expect(userStore.state.loading).toBe(false);
    expect(userStore.state.user).toEqual({ id: 5, name: 'User 5' });
    expect(result).toEqual({ id: 5, name: 'User 5' });
  });

  it('should handle complex thunks with multiple async operations', async () => {
    const mockData = {
      user: { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz' },
      posts: [
        { id: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit' },
        { id: 2, title: 'qui est esse' }
      ],
      comments: [
        { id: 1, name: 'id labore ex et quam laborum', email: 'Eliseo@gardner.biz', body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium' },
        { id: 2, name: 'quo vero reiciendis velit similique earum', email: 'Jayne_Kuhic@sydney.com', body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et' }
      ]
    };

    const mockAsyncOperation = (data, delay) => {
      return new Promise(resolve => setTimeout(() => resolve(data), delay));
    };

    userStore.defineThunk('fetchUserProfile', async ({ dispatch, payload }) => {
      dispatch('setLoading', true);
      dispatch('setError', null);

      const userId = payload;

      try {
        const user = await mockAsyncOperation(mockData.user, 100);
        dispatch('setUser', user);
        console.log('User fetched:', user);

        const posts = await mockAsyncOperation(mockData.posts, 150);
        dispatch('setPosts', posts);
        console.log('Posts fetched:', posts);

        if (posts && posts.length > 0) {
          const comments = await mockAsyncOperation(mockData.comments, 200);
          dispatch('setLatestPostComments', comments);
          console.log('Comments fetched:', comments);
        }

        return { user, posts, latestPostComments: userStore.state.latestPostComments };
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        dispatch('setError', error.message);
        throw error;
      } finally {
        dispatch('setLoading', false);
      }
    });

    const result = await userStore.dispatchAsync('fetchUserProfile', 1);

    console.log('Final state:', userStore.state);
    console.log('Result:', result);

    expect(userStore.state.loading).toBe(false);
    expect(userStore.state.user).toEqual(mockData.user);
    expect(userStore.state.posts).toEqual(mockData.posts);
    expect(userStore.state.latestPostComments).toEqual(mockData.comments);
    expect(result).toEqual({
      user: mockData.user,
      posts: mockData.posts,
      latestPostComments: mockData.comments
    });
  });
});
