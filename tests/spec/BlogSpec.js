import { blogStore } from '../src/blog.js';

describe('Querying the API & Mutating Data - BlogComponent', () => {
  let blogElement;

  beforeEach(async function() {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve([{ id: 1, title: 'Test Post' }])
    }));

    // Create and append the custom element to the DOM
    blogElement = document.createElement('blog-component');
    document.body.appendChild(blogElement);

    await customElements.whenDefined('blog-component');
    await blogElement.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(function() {
    // Clean up the DOM after each test
    if (blogElement && blogElement.parentNode) {
      blogElement.parentNode.removeChild(blogElement);
    }
    // Reset the store state
    blogStore.reset();
  });

  it("should fetch data from the API", async function() {
    await blogStore.query('fetchPosts');
    expect(blogStore.state.posts).toEqual([{ id: 1, title: 'Test Post' }]);
  });

  it("should optimistically add a post", async function() {
    const newPost = { title: 'New Post', body: 'This is a new post.', userId: 1 };
    const optimisticPost = { ...newPost, id: jasmine.any(Number) };

    window.fetch.and.returnValue(Promise.resolve({
      json: () => Promise.resolve(newPost)
    }));

    await blogStore.mutate('createPost', newPost);

    expect(blogStore.state.posts).toContain(jasmine.objectContaining(optimisticPost));
    expect(window.fetch).toHaveBeenCalledWith("https://api.camijs.com/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  });
});
