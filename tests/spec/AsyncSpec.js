import { beforeEach, describe, expect, it } from 'vitest'

const { store } = cami

const initialState = {
  user: null,
  posts: [],
  latestPostComments: [],
  loading: false,
  error: null,
  notifications: [],
}

const userStore = store({
  state: initialState,
  name: 'user-store-test',
  localStorage: false,
})

userStore.defineAction('setUser', ({ state, payload }) => {
  state.user = payload
})

userStore.defineAction('setPosts', ({ state, payload }) => {
  state.posts = payload ? payload : []
})

userStore.defineAction('setLatestPostComments', ({ state, payload }) => {
  state.latestPostComments = payload
})

userStore.defineAction('setLoading', ({ state, payload }) => {
  state.loading = payload
})

userStore.defineAction('setError', ({ state, payload }) => {
  state.error = payload
})

userStore.defineAction('setNotifications', ({ state, payload }) => {
  state.notifications = payload
})

userStore.defineAction('addNotification', ({ state, payload }) => {
  state.notifications.push(payload)
})

describe('Async Actions - Advanced Scenarios', () => {
  beforeEach(() => {
    userStore.dispatch('setUser', null)
    userStore.dispatch('setPosts', [])
    userStore.dispatch('setLatestPostComments', [])
    userStore.dispatch('setLoading', false)
    userStore.dispatch('setError', null)
    userStore.dispatch('setNotifications', [])
  })

  it('should define and dispatch a simple thunk', async () => {
    userStore.defineAsyncAction('simpleThunk', async ({ dispatch }) => {
      dispatch('setLoading', true)
      await new Promise(resolve => setTimeout(resolve, 100))
      dispatch('setUser', { id: 1, name: 'John Doe' })
      dispatch('setLoading', false)
    })

    await userStore.dispatchAsync('simpleThunk')

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().user).toEqual({ id: 1, name: 'John Doe' })
  })

  it('should handle errors in thunks', async () => {
    userStore.defineAsyncAction('errorThunk', async ({ dispatch }) => {
      dispatch('setLoading', true)
      try {
        throw new Error('Test error')
      } catch (error) {
        dispatch('setError', error.message)
      } finally {
        dispatch('setLoading', false)
      }
    })

    await userStore.dispatchAsync('errorThunk')

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().error).toBe('Test error')
  })

  it('should handle thunks with parameters', async () => {
    userStore.defineAsyncAction('fetchUser', async ({ dispatch, payload }) => {
      dispatch('setLoading', true)
      const userId = payload
      const user = { id: userId, name: `User ${userId}` }
      dispatch('setUser', user)
      dispatch('setLoading', false)
      return user
    })

    const result = await userStore.dispatchAsync('fetchUser', 5)

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().user).toEqual({ id: 5, name: 'User 5' })
    expect(result).toEqual({ id: 5, name: 'User 5' })
  })

  it('should handle complex thunks with multiple async operations', async () => {
    const mockData = {
      user: {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
      },
      posts: [
        {
          id: 1,
          title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        },
        { id: 2, title: 'qui est esse' },
      ],
      comments: [
        {
          id: 1,
          name: 'id labore ex et quam laborum',
          email: 'Eliseo@gardner.biz',
          body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium',
        },
        {
          id: 2,
          name: 'quo vero reiciendis velit similique earum',
          email: 'Jayne_Kuhic@sydney.com',
          body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et',
        },
      ],
    }

    const mockAsyncOperation = (data, delay) => {
      return new Promise(resolve => setTimeout(() => resolve(data), delay))
    }

    userStore.defineAsyncAction('fetchUserProfile', async ({ dispatch, payload }) => {
      dispatch('setLoading', true)
      dispatch('setError', null)

      const userId = payload

      try {
        const user = await mockAsyncOperation(mockData.user, 100)
        dispatch('setUser', user)
        console.log('User fetched:', user)

        const posts = await mockAsyncOperation(mockData.posts, 150)
        dispatch('setPosts', posts)
        console.log('Posts fetched:', posts)

        if (posts && posts.length > 0) {
          const comments = await mockAsyncOperation(mockData.comments, 200)
          dispatch('setLatestPostComments', comments)
          console.log('Comments fetched:', comments)
        }

        return {
          user,
          posts,
          latestPostComments: userStore.getState().latestPostComments,
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error)
        dispatch('setError', error.message)
        throw error
      } finally {
        dispatch('setLoading', false)
      }
    })

    const result = await userStore.dispatchAsync('fetchUserProfile', 1)

    console.log('Final state:', userStore.getState())
    console.log('Result:', result)

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().user).toEqual(mockData.user)
    expect(userStore.getState().posts).toEqual(mockData.posts)
    expect(userStore.getState().latestPostComments).toEqual(mockData.comments)
    expect(result).toEqual({
      user: mockData.user,
      posts: mockData.posts,
      latestPostComments: mockData.comments,
    })
  })

  it('should handle asynchronous API requests', async () => {
    const mockApi = {
      fetchUser: id => Promise.resolve({ id, name: `User ${id}` }),
      fetchPosts: userId => Promise.resolve([{ id: 1, title: `Post by User ${userId}` }]),
    }

    userStore.defineAsyncAction('fetchUserAndPosts', async ({ dispatch }, userId) => {
      dispatch('setLoading', true)
      try {
        const user = await mockApi.fetchUser(userId)
        dispatch('setUser', user)
        const posts = await mockApi.fetchPosts(userId)
        dispatch('setPosts', posts)
        return { user, posts }
      } catch (error) {
        dispatch('setError', error.message)
      } finally {
        dispatch('setLoading', false)
      }
    })

    const result = await userStore.dispatchAsync('fetchUserAndPosts', 1)

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().user).toEqual({ id: 1, name: 'User 1' })
    expect(userStore.getState().posts).toEqual([{ id: 1, title: 'Post by User 1' }])
    expect(result).toEqual({
      user: { id: 1, name: 'User 1' },
      posts: [{ id: 1, title: 'Post by User 1' }],
    })
  })

  // Conditional Dispatch
  it('should dispatch actions conditionally based on state', async () => {
    userStore.defineAsyncAction('conditionalFetch', async ({ dispatch, state }) => {
      if (!state.user) {
        dispatch('setLoading', true)
        try {
          const user = await Promise.resolve({
            id: 1,
            name: 'John Doe',
          })
          dispatch('setUser', user)
          dispatch('addNotification', 'User fetched successfully')
        } catch (error) {
          dispatch('setError', error.message)
        } finally {
          dispatch('setLoading', false)
        }
      } else {
        dispatch('addNotification', 'User already loaded')
      }
    })

    // First call should fetch the user
    await userStore.dispatchAsync('conditionalFetch')
    expect(userStore.getState().user).toEqual({ id: 1, name: 'John Doe' })
    expect(userStore.getState().notifications).toContain('User fetched successfully')

    // Second call should not fetch the user again
    await userStore.dispatchAsync('conditionalFetch')
    expect(userStore.getState().notifications).toContain('User already loaded')
  })

  // Complex Action Sequences
  it('should handle complex sequences of actions', async () => {
    const mockApi = {
      login: token => Promise.resolve({ userId: 1 }),
      fetchUserProfile: userId => Promise.resolve({ id: userId, name: 'John Doe' }),
      fetchUserPosts: userId => Promise.resolve([{ id: 1, title: 'First Post' }]),
    }

    userStore.defineAsyncAction('loginAndFetchUserData', async ({ dispatch }, token) => {
      dispatch('setLoading', true)
      dispatch('setError', null)

      try {
        // Login
        const authResult = await mockApi.login(token)
        dispatch('addNotification', 'Login successful')

        // Fetch user profile
        const userProfile = await mockApi.fetchUserProfile(authResult.userId)
        dispatch('setUser', userProfile)
        dispatch('addNotification', 'User profile loaded')

        // Fetch user posts
        const userPosts = await mockApi.fetchUserPosts(authResult.userId)
        dispatch('setPosts', userPosts)
        dispatch('addNotification', 'User posts loaded')

        return { user: userProfile, posts: userPosts }
      } catch (error) {
        dispatch('setError', error.message)
        dispatch('addNotification', 'An error occurred during the process')
      } finally {
        dispatch('setLoading', false)
      }
    })

    const mockToken = 'mock-auth-token'
    const result = await userStore.dispatchAsync('loginAndFetchUserData', mockToken)

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().user).toEqual({ id: 1, name: 'John Doe' })
    expect(userStore.getState().posts).toEqual([{ id: 1, title: 'First Post' }])
    expect(userStore.getState().notifications).toEqual([
      'Login successful',
      'User profile loaded',
      'User posts loaded',
    ])
    expect(userStore.getState().error).toBe(null)
    expect(result).toEqual({
      user: { id: 1, name: 'John Doe' },
      posts: [{ id: 1, title: 'First Post' }],
    })
  })

  // Error handling in complex sequences
  it('should handle errors in complex action sequences', async () => {
    const mockApi = {
      login: () => Promise.resolve({ token: 'abc123', userId: 1 }),
      fetchUserProfile: () => Promise.reject(new Error('Failed to fetch user profile')),
      fetchUserPosts: () => Promise.resolve([{ id: 1, title: 'First Post' }]),
    }

    userStore.defineAsyncAction('loginWithErrorHandling', async ({ dispatch }) => {
      dispatch('setLoading', true)
      dispatch('setError', null)

      try {
        await mockApi.login()
        dispatch('addNotification', 'Login successful')

        await mockApi.fetchUserProfile() // This will throw an error
        dispatch('addNotification', 'User profile loaded') // This should not be called
      } catch (error) {
        dispatch('setError', error.message)
        dispatch('addNotification', 'Failed to load user profile')
      } finally {
        dispatch('setLoading', false)
      }
    })

    await userStore.dispatchAsync('loginWithErrorHandling')

    expect(userStore.getState().loading).toBe(false)
    expect(userStore.getState().error).toBe('Failed to fetch user profile')
    expect(userStore.getState().notifications).toEqual([
      'Login successful',
      'Failed to load user profile',
    ])
  })
})
