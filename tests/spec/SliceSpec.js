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
            const previousState = ctx.previousState;
            ctx.actions.setList(previousState.list);
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

    it("should cycle through all states correctly", function() {
      expect(navigationSlice.status).toBe('menu');
      expect(navigationSlice.count).toBe(0);

      navigationSlice.toggle();
      expect(navigationSlice.status).toBe('settings');
      expect(navigationSlice.count).toBe(1);

      navigationSlice.toggle();
      expect(navigationSlice.status).toBe('profile');
      expect(navigationSlice.count).toBe(2);

      navigationSlice.toggle();
      expect(navigationSlice.status).toBe('menu');
      expect(navigationSlice.count).toBe(3);
    });

    it("should handle multiple toggles correctly", function() {
      for (let i = 0; i < 10; i++) {
        navigationSlice.toggle();
      }
      expect(navigationSlice.count).toBe(10);
      expect(['menu', 'settings', 'profile']).toContain(navigationSlice.status);
    });

    it("should throw an error for non-existent action", function() {
      expect(() => navigationSlice.nonExistentAction()).toThrow();
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

    it("should handle create mutation", async function() {
      const newPost = { title: 'New Test Post' };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({ id: 2, ...newPost })
      }));

      await postSlice.create(newPost);
      expect(postSlice.list.length).toBe(1);
      expect(postSlice.list[0].title).toBe('New Test Post');
    });

    it("should handle delete mutation", async function() {
      postSlice.setList([{ id: 1, title: 'Test Post' }]);
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      await postSlice.delete({ id: 1 });
      expect(postSlice.list.length).toBe(0);
    });

    it("should handle read query with empty response", async function() {
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve([])
      }));

      await postSlice.read();
      expect(postSlice.list.length).toBe(0);
      expect(postSlice.loading).toBe(false);
    });

    it("should handle delete mutation with non-existent id", async function() {
      postSlice.setList([{ id: 1, title: 'Test Post' }]);
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      await postSlice.delete({ id: 999 });
      expect(postSlice.list.length).toBe(1);
    });

    it("should handle concurrent mutations", async function() {
      const post1 = { id: 1, title: 'Post 1' };
      const post2 = { id: 2, title: 'Post 2' };

      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      await Promise.all([
        postSlice.create(post1),
        postSlice.create(post2),
        postSlice.delete({ id: 1 })
      ]);

      expect(postSlice.list.length).toBe(1);
      expect(postSlice.list[0].title).toBe('Post 2');
    });
  });

  describe("Edge Cases and Advanced Scenarios", function() {
    it("should handle deeply nested state updates", function() {
      const deepSlice = slice(`DeepSlice_${uniqueId}`, {
        store: `deep-store-${uniqueId}`,
        state: {
          level1: {
            level2: {
              level3: {
                value: 0
              }
            }
          }
        },
        actions: {
          updateDeep: ({ state, payload }) => {
            state.level1.level2.level3.value = payload;
          }
        }
      });

      deepSlice.updateDeep(42);
      expect(deepSlice.level1.level2.level3.value).toBe(42);
    });

    it("should handle actions that modify multiple slices", function() {
      const slice1 = slice(`Slice1_${uniqueId}`, {
        store: `store1-${uniqueId}`,
        state: { value: 0 },
        actions: {
          increment: ({ state }) => { state.value += 1; }
        }
      });

      const slice2 = slice(`Slice2_${uniqueId}`, {
        store: `store2-${uniqueId}`,
        state: { value: 0 },
        actions: {
          increment: ({ state }) => { state.value += 1; }
        }
      });

      const combinedAction = () => {
        slice1.increment();
        slice2.increment();
      };

      combinedAction();
      expect(slice1.value).toBe(1);
      expect(slice2.value).toBe(1);
    });
  });

});

