const { store, slice } = cami;

describe("Slice functionality", function() {
  let navigationSlice;
  let postSlice;
  let uniqueId;

  beforeEach(() => {
    uniqueId = Date.now();

    navigationSlice = slice(`Navigation_${uniqueId}`, {
      store: `nav-store-${uniqueId}`,
      state: {
        status: 'menu',
        count: 0
      },
      actions: {
        toggle: ({ state }) => {
          const transitions = {
            'menu': 'settings',
            'settings': 'profile',
            'profile': 'menu'
          };
          state.status = transitions[state.status];
          state.count += 1;
        },
        invalidAction: ({ state }) => {
          state.status = 123;
        }
      }
    });

    postSlice = slice(`PostSlice_${uniqueId}`, {
      store: `todo-store-${uniqueId}`,
      state: {
        list: [],
        loading: false,
        error: null
      },
      actions: {
        setList: ({ state, payload }) => {
          state.list = payload;
        },
        setLoading: ({ state, payload }) => {
          state.loading = payload;
        },
        setError: ({ state, payload }) => {
          state.error = payload;
        }
      },
      queries: {
        read: {
          queryKey: ['posts'],
          queryFn: () => fetch("https://api.camijs.com/posts?_limit=5").then(res => res.json()),
          staleTime: 1000 * 60 * 5,
          onFetch: (ctx) => {
            ctx.actions.setLoading(true);
          },
          onError: (ctx) => {
            ctx.actions.setError(ctx.error.message);
          },
          onSuccess: (ctx) => {
            ctx.actions.setList(ctx.response);
          },
          onSettled: (ctx) => {
            ctx.actions.setLoading(false);
          }
        }
      },
      mutations: {
        create: {
          mutationFn: (newPost) => {
            return fetch("https://api.camijs.com/posts", {
              method: "POST",
              body: JSON.stringify(newPost),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then(res => res.json());
          },
          onMutate: (ctx) => {
            const previousList = ctx.state.list;
            ctx.actions.setList([...previousList, ctx.args[0]]);
          },
          onSuccess: (ctx) => {
            ctx.invalidateQueries({ queryKey: ['posts'] });
          },
          onError: (ctx) => {
            // Handle error
          }
        },
        delete: {
          mutationFn: (post) => {
            return fetch(`https://api.camijs.com/posts/${post.id}`, {
              method: "DELETE"
            }).then(res => res.json());
          },
          onMutate: (ctx) => {
            const previousList = ctx.state.list;
            ctx.actions.setList(previousList.filter(p => p.id !== ctx.args[0].id));
            return { previousList };
          },
          onSuccess: (ctx) => {
            ctx.invalidateQueries({ queryKey: ['posts'] });
          },
          onError: (ctx) => {
            ctx.actions.setList(ctx.previousList);
          }
        }
      }
    });
  });

  describe("Navigation Slice", function() {
    it("should initialize with the correct initial state", function() {
      expect(navigationSlice.status).toBe('menu');
      expect(navigationSlice.count).toBe(0);
    });

    it("should handle toggle action correctly", function() {
      navigationSlice.toggle();
      expect(navigationSlice.status).toBe('settings');
      expect(navigationSlice.count).toBe(1);

      navigationSlice.toggle();
      expect(navigationSlice.status).toBe('profile');
      expect(navigationSlice.count).toBe(2);
    });

    it("should throw an error for invalid action", function() {
      expect(() => navigationSlice.invalidAction()).toThrow();
    });
  });

  describe("Post Slice", function() {
    it("should initialize with the correct initial state", function() {
      expect(postSlice.list).toEqual([]);
      expect(postSlice.loading).toBe(false);
      expect(postSlice.error).toBeNull();
    });

    it("should handle setList action correctly", function() {
      const newList = [{ id: 1, title: 'Test Post' }];
      postSlice.setList(newList);
      expect(postSlice.list).toEqual(newList);
    });

    it("should handle setLoading action correctly", function() {
      postSlice.setLoading(true);
      expect(postSlice.loading).toBe(true);
    });

    it("should handle setError action correctly", function() {
      const error = 'Test error';
      postSlice.setError(error);
      expect(postSlice.error).toBe(error);
    });

    // Note: Testing queries and mutations would require mocking fetch and
    // potentially using async/await or done() callback in Jasmine.
    // Here's a basic structure for those tests:

    it("should handle read query", function(done) {
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve([{ id: 1, title: 'Test Post' }])
      }));

      postSlice.read().then(() => {
        expect(postSlice.list.length).toBe(1);
        expect(postSlice.list[0].title).toBe('Test Post');
        expect(postSlice.loading).toBe(false);
        done();
      });
    });

    it("should handle create mutation", function(done) {
      const newPost = { title: 'New Test Post' };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({ id: 2, ...newPost })
      }));

      postSlice.create(newPost).then(() => {
        expect(postSlice.list.length).toBe(1);
        expect(postSlice.list[0].title).toBe('New Test Post');
        done();
      });
    });

    it("should handle delete mutation", function(done) {
      postSlice.setList([{ id: 1, title: 'Test Post' }]);
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      postSlice.delete({ id: 1 }).then(() => {
        expect(postSlice.list.length).toBe(0);
        done();
      });
    });
  });
});
