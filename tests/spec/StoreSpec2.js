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
});
