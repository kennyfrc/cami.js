import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { blogStore } from '../src/blog.js'

describe('Querying the API & Mutating Data - BlogComponent', () => {
  let blogElement
  let fetchSpy

  beforeEach(async function () {
    fetchSpy = vi.spyOn(window, 'fetch')
    fetchSpy.mockReturnValue(
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, title: 'Test Post' }]),
      })
    )

    // Create and append the custom element to the DOM
    blogElement = document.createElement('blog-component')
    document.body.appendChild(blogElement)

    await customElements.whenDefined('blog-component')
    await blogElement.updateComplete

    await new Promise(resolve => setTimeout(resolve, 0))
  })

  afterEach(function () {
    // Clean up the DOM after each test
    if (blogElement && blogElement.parentNode) {
      blogElement.parentNode.removeChild(blogElement)
    }
    // Reset the store state using the action
    blogStore.dispatch('setPosts', [])
    vi.restoreAllMocks()
  })

  it('should fetch data from the API', async function () {
    await blogStore.query('fetchPosts')
    expect(blogStore.getState().posts).toEqual([{ id: 1, title: 'Test Post' }])
  })

  it('should optimistically add a post', async function () {
    const newPost = {
      title: 'New Post',
      body: 'This is a new post.',
      userId: 1,
    }

    fetchSpy.mockReturnValue(
      Promise.resolve({
        json: () => Promise.resolve({ ...newPost, id: 2 }),
      })
    )

    await blogStore.mutate('createPost', newPost)

    const posts = blogStore.getState().posts

    // Check that a new post was added optimistically
    expect(posts).toHaveLength(1)

    // Check that the optimistic post has the correct properties
    const optimisticPost = posts[0]

    expect(optimisticPost).toBeDefined()
    expect(optimisticPost.id).toEqual(expect.any(Number))
    expect(optimisticPost.title).toBe('New Post')
    expect(optimisticPost.body).toBe('This is a new post.')
    expect(optimisticPost.userId).toBe(1)

    expect(fetchSpy).toHaveBeenCalledWith('https://cami-api.exe.xyz/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  })
})
