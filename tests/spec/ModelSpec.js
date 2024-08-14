const { Type } = cami;

describe("Observable Model", function () {
  describe("Basic Functionality", function () {
    let createCartModel;

    beforeEach(function () {
      createCartModel = (uniqueName) =>
        Type.Model(uniqueName, {
          items: Type.Array(
            Type.Object({
              id: Type.Integer,
              name: Type.String,
              price: Type.Float,
            })
          ),
          total: Type.Float,
        }).create({
          state: { items: [], total: 0 },
          actions: {
            addItem: ({ state, payload }) => {
              state.items.push(payload);
              state.total += payload.price;
            },
            removeItem: ({ state, payload: id }) => {
              const item = state.items.find((item) => item.id === id);
              if (item) {
                state.items = state.items.filter((item) => item.id !== id);
                state.total -= item.price;
              }
            },
            setItems: ({ state, payload }) => {
              state.items = payload;
              state.total = payload.reduce((sum, item) => sum + item.price, 0);
            },
          },
          asyncActions: {
            fetchItems: async ({ dispatch }) => {
              const items = await Promise.resolve([
                { id: 1, name: "Test Item", price: 10 },
              ]);
              dispatch("setItems", items);
            },
          },
          memos: {
            itemCount: ({ state }) => state.items.length,
          },
        });
    });

    it("should initialize with the given initial state", function () {
      const cartModel = createCartModel("cart1");
      expect(cartModel.state.items).toEqual([]);
      expect(cartModel.state.total).toBe(0);
    });

    it("should handle action dispatch", function () {
      const cartModel = createCartModel("cart2");
      cartModel.dispatch("addItem", { id: 1, name: "Test Item", price: 10 });
      expect(cartModel.state.items.length).toBe(1);
      expect(cartModel.state.total).toBe(10);
    });

    it("should handle multiple actions", function () {
      const cartModel = createCartModel("cart3");
      cartModel.dispatch("addItem", { id: 1, name: "Item 1", price: 10 });
      cartModel.dispatch("addItem", { id: 2, name: "Item 2", price: 20 });
      expect(cartModel.state.items.length).toBe(2);
      expect(cartModel.state.total).toBe(30);
      cartModel.dispatch("removeItem", 1);
      expect(cartModel.state.items.length).toBe(1);
      expect(cartModel.state.total).toBe(20);
    });

    it("should handle async actions", async function () {
      const cartModel = createCartModel("cart4");
      await cartModel.dispatchAsync("fetchItems");
      expect(cartModel.state.items.length).toBe(1);
      expect(cartModel.state.total).toBe(10);
    });

    it("should compute memos correctly", function () {
      const cartModel = createCartModel("cart5");
      cartModel.dispatch("addItem", { id: 1, name: "Item 1", price: 10 });
      cartModel.dispatch("addItem", { id: 2, name: "Item 2", price: 20 });
      expect(cartModel.memo("itemCount")).toBe(2);
    });

    it("should validate state against the schema", function () {
      const cartModel = createCartModel("cart6");
      expect(() => {
        cartModel.dispatch("addItem", {
          id: "invalid",
          name: 123,
          price: "ten",
        });
      }).toThrow();
    });
  });

  describe("Queries and Mutations", function () {
    let createPostModel;

    beforeEach(function () {
      createPostModel = (uniqueName) =>
        Type.Model(uniqueName, {
          list: Type.Array(
            Type.Object({
              id: Type.Integer,
              title: Type.String,
              body: Type.String,
            })
          ),
          loading: Type.Boolean,
          error: Type.Optional(Type.Sum(Type.String, Type.Object({}))), // Allow null, string, or object
        }).create({
          state: { list: [], loading: false, error: null },
          actions: {
            setLoading: ({ state, payload }) => {
              state.loading = payload;
            },
            setError: ({ state, payload }) => {
              state.error = payload;
            },
            setList: ({ state, payload }) => {
              state.list = payload;
            },
            addPost: ({ state, payload }) => {
              state.list.push(payload);
            },
            removePostById: ({ state, payload: id }) => {
              state.list = state.list.filter((post) => post.id !== id);
            },
          },
          queries: {
            fetchPosts: {
              queryKey: ["posts"],
              queryFn: () =>
                Promise.resolve([
                  {
                    id: 1,
                    title: "Mock Post 1",
                    body: "This is a mock post body",
                  },
                  {
                    id: 2,
                    title: "Mock Post 2",
                    body: "This is another mock post body",
                  },
                ]),
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
            },
          },
          mutations: {
            createPost: {
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
              },
              onSuccess: ({ state, dispatch, data, context }) => {
              },
              onError: ({ dispatch, context }) => {
              },
            },
            deletePost: {
              mutationFn: (post) => {
                return fetch(`https://api.camijs.com/posts/${post.id}`, {
                  method: "DELETE",
                }).then((res) => res.json());
              },
              onMutate: ({ state, payload, dispatch }) => {
                dispatch("removePostById", payload.id);
              },
              onSuccess: ({ invalidateQueries }) => {
                invalidateQueries({ queryKey: ["posts"] });
              },
              onError: ({ previousState, dispatch }) => {
                dispatch("setList", previousState.list || []);
              },
            },
          },
        });
    });

    it("should handle queries", async function () {
      const postModel = createPostModel("posts1");
      await postModel.query("fetchPosts");
      expect(postModel.getState().list.length > 0).toBe(true);
      expect(postModel.getState().loading).toBe(false);
    });
    it("should handle mutations", async function () {
      const postModel = createPostModel("posts2");
      const newPost = {
        id: Date.now(),
        title: "Test Post",
        body: "This is a test post",
      };
      await postModel.mutate("createPost", newPost);

      const postExists = postModel.getState().list.some((post) => post.id === newPost.id);
      expect(postExists).toBe(true);

      await postModel.mutate("deletePost", newPost);
      const postDeleted = !postModel.getState().list.some((post) => post.id === newPost.id);
      expect(postDeleted).toBe(true);
    });
  });

  describe("Complex Model Interactions", function () {
    let createCartModel, createUserModel;

    beforeEach(function () {
      createCartModel = (uniqueName) =>
        Type.Model(uniqueName, {
          items: Type.Array(
            Type.Object({
              id: Type.Integer,
              name: Type.String,
              price: Type.Float,
            })
          ),
          total: Type.Float,
        }).create({
          state: { items: [], total: 0 },
          actions: {
            addItemToCart: ({ state, payload }) => {
              state.items.push(payload);
              state.total += payload.price;
            },
          },
          options: { adapter: "memory" },
        });

      createUserModel = (uniqueName) =>
        Type.Model(uniqueName, {
          id: Type.Optional(Type.Integer),
          name: Type.String,
          cart: Type.Optional(Type.String),
        }).create({
          state: { id: null, name: "", cart: null },
          actions: {
            setUser: ({ state, payload }) => {
              state.id = payload.id;
              state.name = payload.name;
            },
            assignCart: ({ state, payload: cartId }) => {
              state.cart = cartId;
            },
          },
          options: { adapter: "memory" },
        });
    });

    it("should allow interaction between models", function () {
      const cartModel = createCartModel("cart6");
      const userModel = createUserModel("user1");

      userModel.dispatch("setUser", { id: 1, name: "John Doe" });
      cartModel.dispatch("addItemToCart", { id: 1, name: "Item 1", price: 10 });
      userModel.dispatch("assignCart", "cart6");

      expect(userModel.state.id).toBe(1);
      expect(userModel.state.name).toBe("John Doe");
      expect(userModel.state.cart).toBe("cart6");
      expect(cartModel.state.items.length).toBe(1);
      expect(cartModel.state.total).toBe(10);
    });

    it("should maintain separate states for different models", function () {
      const cartModel = createCartModel("cart7");
      const userModel = createUserModel("user2");

      userModel.dispatch("setUser", { id: 1, name: "John Doe" });
      cartModel.dispatch("addItemToCart", { id: 1, name: "Item 1", price: 10 });

      expect(userModel.state).toEqual({ id: 1, name: "John Doe", cart: null });
      expect(cartModel.state).toEqual({
        items: [{ id: 1, name: "Item 1", price: 10 }],
        total: 10,
      });
    });
  });

  describe("Model Scoping and Action Isolation", function () {
    let createCounterModel, createThemeModel, createRootModel;

    beforeEach(function () {
      createCounterModel = (uniqueName) =>
        Type.Model(uniqueName, {
          count: Type.Integer,
        }).create({
          state: { count: 0 },
          actions: {
            increment: ({ state }) => {
              state.count += 1;
            },
            decrement: ({ state }) => {
              state.count -= 1;
            },
          },
        });

      createThemeModel = (uniqueName) =>
        Type.Model(uniqueName, {
          isDark: Type.Boolean,
        }).create({
          state: { isDark: false },
          actions: {
            toggleTheme: ({ state }) => {
              state.isDark = !state.isDark;
            },
            setDark: ({ state }) => {
              state.isDark = true;
            },
            setLight: ({ state }) => {
              state.isDark = false;
            },
          },
        });

      createRootModel = (uniqueName) =>
        Type.Model(uniqueName, {
          counter: Type.Object({
            count: Type.Integer,
          }),
          theme: Type.Object({
            isDark: Type.Boolean,
          }),
        }).create({
          state: {
            counter: { count: 0 },
            theme: { isDark: false },
          },
          actions: {
            resetAll: ({ state }) => {
              state.counter.count = 0;
              state.theme.isDark = false;
            },
          },
        });
    });

    it("should scope actions to their respective models", function () {
      const counterModel = createCounterModel("counter");
      const themeModel = createThemeModel("theme");
      const rootModel = createRootModel("root");

      // Counter actions should work
      counterModel.dispatch("increment");
      expect(counterModel.state.count).toBe(1);

      // Theme actions should work
      themeModel.dispatch("setDark");
      expect(themeModel.state.isDark).toBe(true);

      // Root model should not have access to counter or theme actions
      rootModel.dispatch("increment");
      rootModel.dispatch("setDark");
      // The root model's state should remain unchanged
      expect(rootModel.state.counter.count).toBe(0);
      expect(rootModel.state.theme.isDark).toBe(false);

      // Root model should have access to its own actions
      rootModel.dispatch("resetAll");
      expect(rootModel.state.counter.count).toBe(0);
      expect(rootModel.state.theme.isDark).toBe(false);

      // Changes in individual models should not affect the root model
      counterModel.dispatch("increment");
      themeModel.dispatch("setDark");
      expect(rootModel.state.counter.count).toBe(0);
      expect(rootModel.state.theme.isDark).toBe(false);
    });
  });
});
