import BlogComponent from '../src/blog.js';
import { BlogSlice } from '../src/blog.js';

describe('Querying the API & Mutating Data - BlogComponent', () => {
  let blogComponent;

  beforeEach(async function() {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve([{ id: 1, title: 'Test Post' }])
    }));

    blogComponent = new BlogComponent();
    await blogComponent.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it("should fetch data from the API", async function() {
    await BlogSlice.fetchPosts();
    expect(BlogSlice.posts).toEqual([{ id: 1, title: 'Test Post' }]);
  });

  it("should optimistically add a post", async function() {
    const newPost = { title: 'New Post', body: 'This is a new post.', userId: 1 };
    const optimisticPost = { ...newPost, id: jasmine.any(Number) };

    window.fetch.and.returnValue(Promise.resolve({
      json: () => Promise.resolve(newPost)
    }));

    await BlogSlice.addPost(newPost);

    expect(BlogSlice.posts).toContain(jasmine.objectContaining(optimisticPost));
    expect(window.fetch).toHaveBeenCalledWith("https://api.camijs.com/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  });
});
