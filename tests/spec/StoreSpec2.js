const { store } = cami;

describe("Observable Store (Set 2)", function () {
  let navStore;
  let postStore;
  let uniqueId;

  beforeEach(() => {
    uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    navStore = store({
      state: {
        status: "menu",
        count: 0,
      },
      name: `nav-store-${uniqueId}`,
    });

    navStore.defineAction("toggle", ({ state }) => {
      const transitions = {
        menu: "settings",
        settings: "profile",
        profile: "menu",
      };
      state.status = transitions[state.status];
      state.count += 1;
    });

    navStore.defineAction("invalidAction", ({ state }) => {
      state.status = 123;
    });

    postStore = store({
      state: {
        list: [],
        loading: false,
        error: null,
      },
      name: `post-store-${uniqueId}`,
    });

    postStore.defineAction("setList", ({ state, payload }) => {
      state.list = payload;
    });

    postStore.defineAction("setLoading", ({ state, payload }) => {
      state.loading = payload;
    });

    postStore.defineAction("setError", ({ state, payload }) => {
      state.error = payload;
    });

    postStore.defineAction("removePost", ({ state, payload }) => {
      state.list = state.list.filter((post) => post.id !== payload.id);
    });

    postStore.defineAction("addPost", ({ state, payload }) => {
      state.list.push(payload);
    });

    postStore.defineAction("removePostById", ({ state, payload }) => {
      state.list = state.list.filter((post) => post.id !== payload);
    });

    postStore.defineQuery("fetchPosts", {
      queryKey: ["posts"],
      queryFn: () =>
        fetch("https://api.camijs.com/posts?_limit=5").then((res) =>
          res.json()
        ),
      onFetch: ({ dispatch }) => {
        dispatch("setLoading", true);
      },
      onError: ({ dispatch, error }) => {
        dispatch("setError", error.message);
      },
      onSuccess: ({ dispatch, data }) => {
        dispatch("setList", data || []);
      },
      onSettled: ({ dispatch }) => {
        dispatch("setLoading", false);
      },
    });

    postStore.defineMutation("createPost", {
      mutationFn: (newPost) => {
        return fetch("https://api.camijs.com/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }).then((res) => res.json());
      },
      onMutate: ({ state, payload, dispatch }) => {
        dispatch("addPost", payload);
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
      },
    });

    postStore.defineMutation("deletePost", {
      mutationFn: (post) => {
        return fetch(`https://api.camijs.com/posts/${post.id}`, {
          method: "DELETE",
        }).then((res) => res.json());
      },
      onMutate: ({ state, payload, dispatch }) => {
        const previousList = state.list || [];
        const postToDelete = payload || {};
        const newList = previousList.filter((p) => p.id !== postToDelete.id);
        dispatch("setList", newList);
        console.log(`newList: ${JSON.stringify(newList)}`);
      },
      onSuccess: ({ invalidateQueries }) => {
        // invalidateQueries({ queryKey: ['posts'] });
      },
      onError: ({ previousState, dispatch }) => {
        // dispatch('setList', previousState.list || []);
      },
    });
  });

  afterAll(function () {
    localStorage.clear();
    console.log("localStorage cleared after all tests");
  });

  describe("Navigation Store", function () {
    it("should initialize with the correct initial state", function () {
      expect(navStore.state.status).toBe("menu");
      expect(navStore.state.count).toBe(0);
    });

    it("should handle toggle action correctly", function () {
      navStore.dispatch("toggle");
      expect(navStore.state.status).toBe("settings");
      expect(navStore.state.count).toBe(1);

      navStore.dispatch("toggle");
      expect(navStore.state.status).toBe("profile");
      expect(navStore.state.count).toBe(2);
    });

    it("should cycle through all states correctly", function () {
      expect(navStore.state.status).toBe("menu");
      expect(navStore.state.count).toBe(0);

      navStore.dispatch("toggle");
      expect(navStore.state.status).toBe("settings");
      expect(navStore.state.count).toBe(1);

      navStore.dispatch("toggle");
      expect(navStore.state.status).toBe("profile");
      expect(navStore.state.count).toBe(2);

      navStore.dispatch("toggle");
      expect(navStore.state.status).toBe("menu");
      expect(navStore.state.count).toBe(3);
    });

    it("should handle multiple toggles correctly", function () {
      for (let i = 0; i < 10; i++) {
        navStore.dispatch("toggle");
      }
      expect(navStore.state.count).toBe(10);
      expect(["menu", "settings", "profile"]).toContain(navStore.state.status);
    });
  });

  describe("Post Store", function () {
    it("should initialize with the correct initial state", function () {
      expect(postStore.state.list).toEqual([]);
      expect(postStore.state.loading).toBe(false);
      expect(postStore.state.error).toBeNull();
    });

    it("should handle setList action correctly", function () {
      const newList = [{ id: 1, title: "Test Post" }];
      postStore.dispatch("setList", newList);
      expect(postStore.state.list).toEqual(newList);
    });

    it("should handle setLoading action correctly", function () {
      postStore.dispatch("setLoading", true);
      expect(postStore.state.loading).toBe(true);
    });

    it("should handle setError action correctly", function () {
      const error = "Test error";
      postStore.dispatch("setError", error);
      expect(postStore.state.error).toBe(error);
    });

    it("should handle create mutation", function () {
      const newPost = { title: "New Test Post" };
      spyOn(window, "fetch").and.returnValue(
        Promise.resolve({
          json: () => Promise.resolve({ id: 2, ...newPost }),
        })
      );

      postStore.dispatch("addPost", newPost);
      expect(postStore.state.list.length).toBe(1);
      expect(postStore.state.list[0].title).toBe("New Test Post");
    });

    it("should handle delete mutation", function () {
      postStore.dispatch("setList", [{ id: 1, title: "Test Post" }]);
      spyOn(window, "fetch").and.returnValue(
        Promise.resolve({
          json: () => Promise.resolve({}),
        })
      );

      postStore.dispatch("removePost", { id: 1 });

      expect(postStore.state.list.length).toBe(0);
    });

    it("should handle read query with empty data", async function () {
      spyOn(window, "fetch").and.returnValue(
        Promise.resolve({
          json: () => Promise.resolve([]),
        })
      );

      const readPromise = postStore.query("fetchPosts");

      // Wait for the read operation to complete
      await readPromise;

      // Wait for any pending microtasks to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(postStore.state.list.length).toBe(0);
      expect(postStore.state.loading).toBe(false);
    });

    it("should handle delete mutation with non-existent id", function () {
      postStore.dispatch("setList", [{ id: 1, title: "Test Post" }]);

      spyOn(window, "fetch").and.returnValue(
        Promise.resolve({
          json: () => Promise.resolve({}),
        })
      );

      postStore.dispatch("removePost", { id: 999 });

      expect(postStore.state.list.length).toBe(1);
    });

    it("should handle concurrent mutations", async function () {
      const post1 = { id: 1, title: "Post 1" };
      const post2 = { id: 2, title: "Post 2" };

      let resolveCreate1, resolveCreate2, resolveDelete;
      const create1Promise = new Promise((resolve) => {
        resolveCreate1 = resolve;
      });
      const create2Promise = new Promise((resolve) => {
        resolveCreate2 = resolve;
      });
      const deletePromise = new Promise((resolve) => {
        resolveDelete = resolve;
      });

      spyOn(window, "fetch").and.callFake((url, options) => {
        if (options && options.method === "POST") {
          const body = JSON.parse(options.body);
          if (body && body.title === "Post 1") {
            return create1Promise;
          } else {
            return create2Promise;
          }
        } else if (options && options.method === "DELETE") {
          return deletePromise;
        }
        // Default case to avoid undefined
        return Promise.resolve({ json: () => Promise.resolve({}) });
      });

      postStore.mutate("createPost", post1),
        postStore.mutate("createPost", post2),
        postStore.mutate("deletePost", { id: 1 });

      const list = postStore.state.list;
      expect(list.length).toBe(1);
      expect(list[0].title).toBe("Post 2");
    });
  });

  describe("Edge Cases and Advanced Scenarios", function () {
    it("should handle deeply nested state updates", function () {
      const deepStore = store({
        state: {
          level1: {
            level2: {
              level3: {
                value: 0,
              },
            },
          },
        },
        name: `deep-store-${uniqueId}`,
      });

      deepStore.defineAction("updateDeep", ({ state, payload }) => {
        state.level1.level2.level3.value = payload;
      });

      deepStore.dispatch("updateDeep", 42);
      expect(deepStore.state.level1.level2.level3.value).toBe(42);
    });

    it("should handle actions that modify multiple stores", function () {
      const store1 = store({
        state: { value: 0 },
        name: `store1-${uniqueId}`,
      });

      store1.defineAction("increment", ({ state }) => {
        state.value += 1;
      });

      const store2 = store({
        state: { value: 0 },
        name: `store2-${uniqueId}`,
      });

      store2.defineAction("increment", ({ state }) => {
        state.value += 1;
      });

      const combinedAction = () => {
        store1.dispatch("increment");
        store2.dispatch("increment");
      };

      combinedAction();
      expect(store1.state.value).toBe(1);
      expect(store2.state.value).toBe(1);
    });
  });
});
