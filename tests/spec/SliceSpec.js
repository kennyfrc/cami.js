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
      }
    });

    NavModel.register({
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
      }
    });

    PostModel.register({
      actions: {
        setList: ({ state, payload }) => {
          state.list = payload
        },
        setLoading: ({ state, payload }) => {
          state.loading = payload;
        },
        setError: ({ state, payload }) => {
          state.error = payload;
        },
        removePost: ({ state, payload }) => {
          state.list = state.list.filter(post => post.id !== payload.id);
        },
        addPost: ({ state, payload }) => {
          state.list.push(payload);
        },
        removePostById: ({ state, payload }) => {
          state.list = state.list.filter(post => post.id !== payload);
        }
      },
      queries: {
        fetchPosts: {
          queryKey: ['posts'],
          queryFn: () => fetch("https://api.camijs.com/posts?_limit=5").then(res => res.json()),
          onFetch: ({ dispatch }) => {
            dispatch('setLoading', true);
          },
          onError: ({ dispatch, error }) => {
            dispatch('setError', error.message);
          },
          onSuccess: ({ dispatch, data }) => {
            dispatch('setList', data || []);
          },
          onSettled: ({ dispatch }) => {
            dispatch('setLoading', false);
          }
        }
      },
      mutations: {
        createPost: {
          mutationFn: (newPost) => {
            return fetch("https://api.camijs.com/posts", {
              method: "POST",
              body: JSON.stringify(newPost),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then(res => res.json());
          },
          onMutate: ({ state, payload, dispatch }) => {
            dispatch('addPost', payload);

            console.log(`newPost: ${JSON.stringify(payload)}`);
          },
          onSuccess: ({ data, dispatch }) => {
            // dispatch('addPost', data);
          },
          onError: ({ dispatch, payload }) => {
            // dispatch('removePostById', payload.id);
          },
          onSettled: ({ dispatch, state }) => {
            // debugger
          }
        },
        deletePost: {
          mutationFn: (post) => {
            return fetch(`https://api.camijs.com/posts/${post.id}`, {
              method: "DELETE"
            }).then(res => res.json());
          },
          onMutate: ({ state, payload, dispatch }) => {
            const previousList = state.list || [];
            const postToDelete = payload || {};
            const newList = previousList.filter(p => p.id !== postToDelete.id);

            dispatch('setList', newList);

            console.log(`newList: ${JSON.stringify(newList)}`);
          },
          onSuccess: ({ invalidateQueries }) => {
            // invalidateQueries({ queryKey: ['posts'] });
          },
          onError: ({ previousState, dispatch }) => {
            // dispatch('setList', previousState.list || []);
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
      NavModel.dispatch('toggle');
      expect(NavModel.status).toBe('settings');
      expect(NavModel.count).toBe(1);

      NavModel.dispatch('toggle');
      expect(NavModel.status).toBe('profile');
      expect(NavModel.count).toBe(2);
    });

    it("should throw an error for invalid action", function() {
      expect(() => NavModel.dispatch('invalidAction')).toThrow();
    });

    it("should cycle through all states correctly", function() {
      expect(NavModel.status).toBe('menu');
      expect(NavModel.count).toBe(0);

      NavModel.dispatch('toggle');
      expect(NavModel.status).toBe('settings');
      expect(NavModel.count).toBe(1);

      NavModel.dispatch('toggle');
      expect(NavModel.status).toBe('profile');
      expect(NavModel.count).toBe(2);

      NavModel.dispatch('toggle');
      expect(NavModel.status).toBe('menu');
      expect(NavModel.count).toBe(3);
    });

    it("should handle multiple toggles correctly", function() {
      for (let i = 0; i < 10; i++) {
        NavModel.dispatch('toggle');
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
      PostModel.dispatch('setList', newList);
      expect(PostModel.list).toEqual(newList);
    });

    it("should handle setLoading action correctly", function() {
      PostModel.dispatch('setLoading', true);
      expect(PostModel.loading).toBe(true);
    });

    it("should handle setError action correctly", function() {
      const error = 'Test error';
      PostModel.dispatch('setError', error);
      expect(PostModel.error).toBe(error);
    });

    it("should handle create mutation", function() {
      const newPost = { title: 'New Test Post' };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({ id: 2, ...newPost })
      }));

      PostModel.dispatch('addPost', newPost);
      expect(PostModel.list.length).toBe(1);
      expect(PostModel.list[0].title).toBe('New Test Post');
    });

    it("should handle delete mutation", function() {
      PostModel.dispatch('setList', [{ id: 1, title: 'Test Post' }]);
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      PostModel.dispatch('removePost', { id: 1 });

      expect(PostModel.list.length).toBe(0);
    });

    it("should handle read query with empty data", async function() {
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve([])
      }));

      const readPromise = PostModel.query('fetchPosts');

      // Wait for the read operation to complete
      await readPromise;

      // Wait for any pending microtasks to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(PostModel.list.length).toBe(0);
      expect(PostModel.loading).toBe(false);
    });

    it("should handle delete mutation with non-existent id", function() {
      PostModel.dispatch('setList', [{ id: 1, title: 'Test Post' }]);

      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        json: () => Promise.resolve({})
      }));

      PostModel.dispatch('removePost', { id: 999 });

      expect(PostModel.list.length).toBe(1);
    });

    it("should handle concurrent mutations", async function() {
      const post1 = { id: 1, title: 'Post 1' };
      const post2 = { id: 2, title: 'Post 2' };

      let resolveCreate1, resolveCreate2, resolveDelete;
      const create1Promise = new Promise(resolve => { resolveCreate1 = resolve; });
      const create2Promise = new Promise(resolve => { resolveCreate2 = resolve; });
      const deletePromise = new Promise(resolve => { resolveDelete = resolve; });

      spyOn(window, 'fetch').and.callFake((url, options) => {
        if (options && options.method === 'POST') {
          const body = JSON.parse(options.body);
          if (body && body.title === 'Post 1') {
            return create1Promise;
          } else {
            return create2Promise;
          }
        } else if (options && options.method === 'DELETE') {
          return deletePromise;
        }
        // Default case to avoid undefined
        return Promise.resolve({ json: () => Promise.resolve({}) });
      });

      PostModel.mutate('createPost', post1),
      PostModel.mutate('createPost', post2),
      PostModel.mutate('deletePost', { id: 1 })

      const list = PostModel.list;
      expect(list.length).toBe(1);
      expect(list[0].title).toBe('Post 2');
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
        }
      });

      deepModel.register({
        actions: {
          updateDeep: ({ state, payload }) => {
          state.level1.level2.level3.value = payload;
          }
        }
      });

      deepModel.dispatch('updateDeep', 42);
      expect(deepModel.level1.level2.level3.value).toBe(42);
    });

    it("should handle actions that modify multiple models", function() {
      const model1 = model(`Model1_${uniqueId}`, {
        store: `store1-${uniqueId}`,
        state: { value: 0 }
      });

      model1.register({
        actions: {
          increment: ({ state }) => { state.value += 1; }
        }
      });

      const model2 = model(`Model2_${uniqueId}`, {
        store: `store2-${uniqueId}`,
        state: { value: 0 }
      });

      model2.register({
        actions: {
          increment: ({ state }) => { state.value += 1; }
        }
      });

      const combinedAction = () => {
        model1.dispatch('increment');
        model2.dispatch('increment');
      };

      combinedAction();
      expect(model1.value).toBe(1);
      expect(model2.value).toBe(1);
    });
  });
});
