const { store, model } = cami;

describe("Model functionality", function() {
  let NavModel;
  let PostModel;
  let uniqueId;

  beforeEach(() => {
    uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    NavModel = model(`Navigation_${uniqueId}`, {
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

    PostModel = model(`PostModel_${uniqueId}`, {
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
            const newPost = ctx.payload || {};
            ctx.actions.setList([...previousList, newPost]);
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
            const postToDelete = ctx.payload || {};
            ctx.actions.setList(previousList.filter(p => p.id !== postToDelete.id));
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

  afterAll(function() {
    localStorage.clear();
    console.log('localStorage cleared after all tests');
  });

  describe("Navigation Model", function() {
    it("should initialize with the correct initial state", function() {
      expect(NavModel.status).toBe('menu');
      expect(NavModel.count).toBe(0);
    });

    it("should handle toggle action correctly", function() {
      NavModel.toggle();
      expect(NavModel.status).toBe('settings');
      expect(NavModel.count).toBe(1);

      NavModel.toggle();
      expect(NavModel.status).toBe('profile');
      expect(NavModel.count).toBe(2);
    });

    it("should throw an error for invalid action", function() {
      expect(() => NavModel.invalidAction()).toThrow();
    });

    it("should cycle through all states correctly", function() {
      expect(NavModel.status).toBe('menu');
      expect(NavModel.count).toBe(0);

      NavModel.toggle();
      expect(NavModel.status).toBe('settings');
      expect(NavModel.count).toBe(1);

      NavModel.toggle();
      expect(NavModel.status).toBe('profile');
      expect(NavModel.count).toBe(2);

      NavModel.toggle();
      expect(NavModel.status).toBe('menu');
      expect(NavModel.count).toBe(3);
    });

    it("should handle multiple toggles correctly", function() {
      for (let i = 0; i < 10; i++) {
        NavModel.toggle();
      }
      expect(NavModel.count).toBe(10);
      expect(['menu', 'settings', 'profile']).toContain(NavModel.status);
    });
  });

  describe("Post Model", function() {
    it("should initialize with the correct initial state", function() {
      expect(PostModel.list).toEqual([]);
      expect(PostModel.loading).toBe(false);
      expect(PostModel.error).toBeNull();
    });

    it("should handle setList action correctly", function() {
      const newList = [{ id: 1, title: 'Test Post' }];
      PostModel.setList(newList);
      expect(PostModel.list).toEqual(newList);
    });

    it("should handle setLoading action correctly", function() {
      PostModel.setLoading(true);
      expect(PostModel.loading).toBe(true);
    });

    it("should handle setError action correctly", function() {
      const error = 'Test error';
      PostModel.setError(error);
      expect(PostModel.error).toBe(error);
    });

    it("should handle create mutation", async function() {
      const newPost = { title: 'New Test Post' };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({ id: 2, ...newPost })
      }));

      await PostModel.create(newPost);
      expect(PostModel.list.length).toBe(1);
      expect(PostModel.list[0].title).toBe('New Test Post');
    });

    it("should handle delete mutation", async function() {
      PostModel.setList([{ id: 1, title: 'Test Post' }]);
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      await PostModel.delete({ id: 1 });
      expect(PostModel.list.length).toBe(0);
    });

    it("should handle read query with empty response", async function() {
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve([])
      }));

      await PostModel.read();
      expect(PostModel.list.length).toBe(0);
      expect(PostModel.loading).toBe(false);
    });

    it("should handle delete mutation with non-existent id", async function() {
      PostModel.setList([{ id: 1, title: 'Test Post' }]);
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      await PostModel.delete({ id: 999 });
      expect(PostModel.list.length).toBe(1);
    });

    it("should handle concurrent mutations", async function() {
      const post1 = { id: 1, title: 'Post 1' };
      const post2 = { id: 2, title: 'Post 2' };

      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      await Promise.all([
        PostModel.create(post1),
        PostModel.create(post2),
        PostModel.delete({ id: 1 })
      ]);

      expect(PostModel.list.length).toBe(1);
      expect(PostModel.list[0].title).toBe('Post 2');
    });
  });

  describe("Edge Cases and Advanced Scenarios", function() {
    it("should handle deeply nested state updates", function() {
      const deepModel = model(`DeepModel_${uniqueId}`, {
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

      deepModel.updateDeep(42);
      expect(deepModel.level1.level2.level3.value).toBe(42);
    });

    it("should handle actions that modify multiple models", function() {
      const model1 = model(`Model1_${uniqueId}`, {
        store: `store1-${uniqueId}`,
        state: { value: 0 },
        actions: {
          increment: ({ state }) => { state.value += 1; }
        }
      });

      const model2 = model(`Model2_${uniqueId}`, {
        store: `store2-${uniqueId}`,
        state: { value: 0 },
        actions: {
          increment: ({ state }) => { state.value += 1; }
        }
      });

      const combinedAction = () => {
        model1.increment();
        model2.increment();
      };

      combinedAction();
      expect(model1.value).toBe(1);
      expect(model2.value).toBe(1);
    });
  });
});
