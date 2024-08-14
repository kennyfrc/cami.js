const { store, Type, useValidationThunk } = cami;

describe("Observable Store (Set 2)", function () {
  let navStore;
  let postStore;
  let uniqueId;

  beforeEach(() => {
    uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const navStoreSchema = Type.Product({
      navigation: Type.Product({
        sidebar: Type.String,
        center: Type.String
      }),
      count: Type.Integer
    });

    navStore = store({
      state: {
        navigation: {
          sidebar: "chat",
          center: "documents"
        },
        count: 0,
      },
      name: `nav-store-${uniqueId}`,
    });

    navStore.afterHook(({ state, previousState }) => {
      if (state !== previousState) {
        useValidationThunk(navStoreSchema)(state);
      }
    });

    navStore.defineAction("updateNavigation", ({ state, payload }) => {
      Object.assign(state.navigation, payload);
    });

    navStore.defineAction("incrementCount", ({ state }) => {
      state.count += 1;
    });

    const postStoreSchema = Type.Product({
      list: Type.Array(Type.Product({
        id: Type.Integer,
        title: Type.String,
        content: Type.Optional(Type.String)
      })),
      loading: Type.Boolean,
      error: Type.Optional(Type.String)
    });

    postStore = store({
      state: {
        list: [],
        loading: false,
        error: null,
      },
      name: `post-store-${uniqueId}`,
    });

    postStore.afterHook(({ state, previousState }) => {
      if (state !== previousState) {
        useValidationThunk(postStoreSchema)(state);
      }
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

    postStore.defineAction("addPost", ({ state, payload }) => {
      state.list.push(payload);
    });

    postStore.defineAction("removePostById", ({ state, payload }) => {
      state.list = state.list.filter((post) => post.id !== payload);
    });

    postStore.defineMutation("createPost", {
      mutationFn: (newPost) => Promise.resolve({ ...newPost, id: Date.now() }),
      onMutate: ({ state, payload, dispatch }) => {
        dispatch("addPost", payload);
      },
    });

    postStore.defineMutation("deletePost", {
      mutationFn: (post) => Promise.resolve(post),
      onMutate: ({ state, payload, dispatch }) => {
        dispatch("removePostById", payload.id);
      },
    });
  });

  describe("Navigation Store", function () {
    it("should initialize with the correct initial state", function () {
      expect(navStore.state.navigation.sidebar).toBe("chat");
      expect(navStore.state.navigation.center).toBe("documents");
      expect(navStore.state.count).toBe(0);
    });

    it("should handle updateNavigation action correctly", function () {
      navStore.dispatch("updateNavigation", { sidebar: "settings" });
      expect(navStore.state.navigation.sidebar).toBe("settings");
      expect(navStore.state.navigation.center).toBe("documents");
      expect(navStore.state.count).toBe(0);
    });
  });

  describe("Post Store", function () {
    it("should initialize with the correct initial state", function () {
      expect(postStore.state.list).toEqual([]);
      expect(postStore.state.loading).toBe(false);
      expect(postStore.state.error).toBe(null);
    });

    it("should handle setList action correctly", function () {
      const newList = [{ id: 1, title: "Test Post" }];
      postStore.dispatch("setList", newList);
      expect(postStore.state.list).toEqual(newList);
    });

    it("should handle create mutation", async function () {
      const newPost = { title: "New Test Post" };
      await postStore.mutate("createPost", newPost);
      expect(postStore.state.list.length).toBe(1);
      expect(postStore.state.list[0].title).toEqual(newPost.title);
    });

    it("should handle delete mutation", async function () {
      const initialPost = { id: 1, title: "Test Post" };
      postStore.dispatch("setList", [initialPost]);
      await postStore.mutate("deletePost", { id: 1 });
      expect(postStore.state.list.length).toBe(0);
    });

    it("should handle concurrent mutations", async function () {
      const post1 = { title: "Post 1" };
      const post2 = { title: "Post 2" };

      await Promise.all([
        postStore.mutate("createPost", post1),
        postStore.mutate("createPost", post2),
        postStore.mutate("deletePost", { id: 1 })
      ]);

      expect(postStore.state.list.length).toBe(2);
      expect(postStore.state.list[0].title).toEqual("Post 1");
      expect(postStore.state.list[1].title).toEqual("Post 2");
    });
  });

  describe("Partial Updates with Type Checking", function () {
    it("should allow partial updates to navigation state", function () {
      navStore.dispatch("updateNavigation", { sidebar: "settings" });
      expect(navStore.state.navigation.sidebar).toBe("settings");
      expect(navStore.state.navigation.center).toBe("documents");
    });

    it("should throw an error when updating with incorrect type", function () {
      expect(() => {
        navStore.dispatch("updateNavigation", { sidebar: 123 });
      }).toThrow();
    });

    it("should allow adding a new post with partial data", function () {
      const newPost = { id: 1, title: "Partial Post" };
      postStore.dispatch("addPost", newPost);
      expect(postStore.state.list.length).toBe(1);
      expect(postStore.state.list[0].id).toBe(newPost.id);
      expect(postStore.state.list[0].title).toBe(newPost.title);
      expect(postStore.state.list[0].content).toBe(undefined);
    });

    it("should throw an error when adding a post with incorrect data type", function () {
      const invalidPost = { id: "not a number", title: 123 };
      expect(() => {
        postStore.dispatch("addPost", invalidPost);
      }).toThrow();
    });

    it("should allow updating an existing post partially", function () {
      const initialPost = { id: 1, title: "Initial Post", content: "Some content" };
      postStore.dispatch("addPost", initialPost);

      postStore.defineAction("updatePost", ({ state, payload }) => {
        const postIndex = state.list.findIndex(post => post.id === payload.id);
        if (postIndex !== -1) {
          Object.assign(state.list[postIndex], payload);
        }
      });

      postStore.dispatch("updatePost", { id: 1, title: "Updated Post" });
      expect(postStore.state.list[0]).toEqual({
        id: 1,
        title: "Updated Post",
        content: "Some content"
      });
    });

    it("should maintain type checking for optional fields", function () {
      const postWithoutContent = { id: 2, title: "No Content Post" };
      postStore.dispatch("addPost", postWithoutContent);
      expect(postStore.state.list[0].content).toBe(undefined);

      const postWithContent = { id: 3, title: "With Content", content: "Some content" };
      postStore.dispatch("addPost", postWithContent);
      expect(postStore.state.list[1].content).toBe("Some content");
    });

    it("should throw an error when violating schema in afterHook", function () {
      expect(() => {
        navStore.dispatch("updateNavigation", { sidebar: 123 });
      }).toThrow();

      expect(() => {
        postStore.dispatch("addPost", { id: "not a number", title: "Invalid Post" });
      }).toThrow();
    });
  });
});
