const { store, Type, useValidationThunk } = cami;
import { _deepMerge } from "../../src/utils"

describe("Observable Store (Set 2)", function () {
  let navStore;
  let postStore;
  let uniqueId;

  beforeEach(() => {
    uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const navStoreSchema = Type.Product({
      navigation: Type.Product({
        sidebar: Type.String,
        center: Type.String,
        topbar: Type.String
      }),
      count: Type.Integer
    });

    navStore = store({
      state: {
        navigation: {
          sidebar: "chat",
          center: "documents",
          topbar: "default"
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

    navStore.defineMachine("navigation", {
      toggle_chat: {
        from: [
          { navigation: { center: "documents" } },
          { navigation: { center: "chat" } }
        ],
        to: ({state}) => ({
          navigation: {
            ...state.navigation,
            center: state.navigation.center === "chat" ? "documents" : "chat"
          }
        }),
        onExit: function({ state, previousState }) {
          navStore.onExitSpy(state.navigation, previousState.navigation);
        },
        onEntry: function({ state, previousState }) {
          navStore.onEntrySpy(state.navigation, previousState.navigation);
        }
      },
      CHANGE_SIDEBAR: {
        from: [{ navigation: {} }],
        to: ({state, payload}) => ({
          navigation: {
            ...state.navigation,
            sidebar: payload
          }
        })
      }
    });

    navStore.onExitSpy = spyOn(navStore, 'onExitSpy');
    navStore.onEntrySpy = spyOn(navStore, 'onEntrySpy');

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

    postStore.defineAction("updatePost", ({ state, payload }) => {
      const postIndex = state.list.findIndex(post => post.id === payload.id);
      if (postIndex !== -1) {
        state.list[postIndex] = { ...state.list[postIndex], ...payload };
        // Handle undefined values explicitly
        Object.keys(payload).forEach(key => {
          if (payload[key] === undefined) {
            delete state.list[postIndex][key];
          }
        });
      }
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
      expect(navStore.getState().navigation.sidebar).toBe("chat");
      expect(navStore.getState().navigation.center).toBe("documents");
      expect(navStore.getState().navigation.topbar).toBe("default");
      expect(navStore.getState().count).toBe(0);
    });

    it("should handle updateNavigation action correctly", function () {
      navStore.dispatch("updateNavigation", { sidebar: "settings" });
      expect(navStore.getState().navigation.sidebar).toBe("settings");
      expect(navStore.getState().navigation.center).toBe("documents");
      expect(navStore.getState().navigation.topbar).toBe("default");
      expect(navStore.getState().count).toBe(0);
    });
  });

  describe("Post Store", function () {
    it("should initialize with the correct initial state", function () {
      expect(postStore.getState().list).toEqual([]);
      expect(postStore.getState().loading).toBe(false);
      expect(postStore.getState().error).toBe(null);
    });

    it("should handle setList action correctly", function () {
      const newList = [{ id: 1, title: "Test Post" }];
      postStore.dispatch("setList", newList);
      expect(postStore.getState().list).toEqual(newList);
    });

    it("should handle create mutation", async function () {
      const newPost = { title: "New Test Post" };
      await postStore.mutate("createPost", newPost);
      expect(postStore.getState().list.length).toBe(1);
      expect(postStore.getState().list[0].title).toEqual(newPost.title);
    });

    it("should handle delete mutation", async function () {
      const initialPost = { id: 1, title: "Test Post" };
      postStore.dispatch("setList", [initialPost]);
      await postStore.mutate("deletePost", { id: 1 });
      expect(postStore.getState().list.length).toBe(0);
    });

    it("should handle concurrent mutations", async function () {
      const post1 = { title: "Post 1" };
      const post2 = { title: "Post 2" };

      await Promise.all([
        postStore.mutate("createPost", post1),
        postStore.mutate("createPost", post2),
        postStore.mutate("deletePost", { id: 1 })
      ]);

      expect(postStore.getState().list.length).toBe(2);
      expect(postStore.getState().list[0].title).toEqual("Post 1");
      expect(postStore.getState().list[1].title).toEqual("Post 2");
    });
  });

  describe("Partial Updates with Type Checking", function () {
    it("should allow partial updates to navigation state", function () {
      navStore.dispatch("updateNavigation", { sidebar: "settings" });
      expect(navStore.getState().navigation.sidebar).toBe("settings");
      expect(navStore.getState().navigation.center).toBe("documents");
      expect(navStore.getState().navigation.topbar).toBe("default");
    });

    it("should throw an error when updating with incorrect type", function () {
      expect(() => {
        navStore.dispatch("updateNavigation", { sidebar: 123 });
      }).toThrow();
    });

    it("should allow adding a new post with partial data", function () {
      const newPost = { id: 1, title: "Partial Post" };
      postStore.dispatch("addPost", newPost);
      expect(postStore.getState().list.length).toBe(1);
      expect(postStore.getState().list[0].id).toBe(newPost.id);
      expect(postStore.getState().list[0].title).toBe(newPost.title);
      expect(postStore.getState().list[0].content).toBe(undefined);
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

      postStore.dispatch("updatePost", { id: 1, title: "Updated Post" });
      expect(postStore.getState().list[0]).toEqual({
        id: 1,
        title: "Updated Post",
        content: "Some content"
      });

      postStore.dispatch("updatePost", { id: 1, content: "New content" });
      expect(postStore.getState().list[0]).toEqual({
        id: 1,
        title: "Updated Post",
        content: "New content"
      });
    });

    it("should maintain type checking for optional fields", function () {
      const postWithoutContent = { id: 2, title: "No Content Post" };
      postStore.dispatch("addPost", postWithoutContent);
      expect(postStore.getState().list[0].content).toBe(undefined);

      const postWithContent = { id: 3, title: "With Content", content: "Some content" };
      postStore.dispatch("addPost", postWithContent);
      expect(postStore.getState().list[1].content).toBe("Some content");

      postStore.dispatch("updatePost", { id: 2, content: "Added content" });
      expect(postStore.getState().list.find(post => post.id === 2)?.content).toBe("Added content");

      postStore.dispatch("updatePost", { id: 3, content: undefined });
      expect(postStore.getState().list.find(post => post.id === 3)?.content).toBe(undefined);
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

  describe("Partial Updates with Type Checking 2", function () {
    it("should allow partial updates to navigation state", function () {
      navStore.dispatch("updateNavigation", { sidebar: "settings" });
      expect(navStore.getState().navigation.sidebar).toBe("settings");
      expect(navStore.getState().navigation.center).toBe("documents");
      expect(navStore.getState().navigation.topbar).toBe("default");
    });

    it("should retain existing properties when updating partially", function () {
      navStore.dispatch("updateNavigation", { sidebar: "profile" });
      expect(navStore.getState().navigation.sidebar).toBe("profile");
      expect(navStore.getState().navigation.center).toBe("documents");
      expect(navStore.getState().navigation.topbar).toBe("default");

      navStore.dispatch("updateNavigation", { center: "chat" });
      expect(navStore.getState().navigation.sidebar).toBe("profile");
      expect(navStore.getState().navigation.center).toBe("chat");
      expect(navStore.getState().navigation.topbar).toBe("default");
    });

    it("should handle nested partial updates", function () {
      const complexStore = store({
        state: {
          user: {
            profile: {
              name: "John",
              age: 30,
              address: {
                city: "New York",
                country: "USA"
              }
            },
            settings: {
              theme: "dark",
              notifications: true
            }
          }
        },
        name: "complex-store"
      });

      complexStore.defineAction("updateUser", ({ state, payload }) => {
        _deepMerge(state.user, payload);
      });

      complexStore.dispatch("updateUser", { profile: { age: 31 } });
      expect(complexStore.state.user.profile.name).toBe("John");
      expect(complexStore.state.user.profile.age).toBe(31);
      expect(complexStore.state.user.profile.address.city).toBe("New York");

      complexStore.dispatch("updateUser", { profile: { address: { city: "Los Angeles" } } });
      expect(complexStore.state.user.profile.name).toBe("John");
      expect(complexStore.state.user.profile.age).toBe(31);
      expect(complexStore.state.user.profile.address.city).toBe("Los Angeles");
      expect(complexStore.state.user.profile.address.country).toBe("USA");
      expect(complexStore.state.user.settings.theme).toBe("dark");
    });

    it("should throw an error when updating with incorrect type", function () {
      expect(() => {
        navStore.dispatch("updateNavigation", { sidebar: 123 });
      }).toThrow();
    });

    it("should allow adding a new post with partial data", function () {
      const newPost = { id: 1, title: "Partial Post" };
      postStore.dispatch("addPost", newPost);
      expect(postStore.getState().list.length).toBe(1);
      expect(postStore.getState().list[0].id).toBe(newPost.id);
      expect(postStore.getState().list[0].title).toBe(newPost.title);
      expect(postStore.getState().list[0].content).toBe(undefined);
    });

    it("should allow updating an existing post partially", function () {
      const initialPost = { id: 1, title: "Initial Post", content: "Some content" };
      postStore.dispatch("addPost", initialPost);

      postStore.dispatch("updatePost", { id: 1, title: "Updated Post" });
      expect(postStore.getState().list[0]).toEqual({
        id: 1,
        title: "Updated Post",
        content: "Some content"
      });

      postStore.dispatch("updatePost", { id: 1, content: "New content" });
      expect(postStore.getState().list[0]).toEqual({
        id: 1,
        title: "Updated Post",
        content: "New content"
      });
    });

    it("should maintain type checking for optional fields", function () {
      const postWithoutContent = { id: 2, title: "No Content Post" };
      postStore.dispatch("addPost", postWithoutContent);
      expect(postStore.getState().list[0].content).toBe(undefined);

      const postWithContent = { id: 3, title: "With Content", content: "Some content" };
      postStore.dispatch("addPost", postWithContent);
      expect(postStore.getState().list[1].content).toBe("Some content");

      postStore.dispatch("updatePost", { id: 2, content: "Added content" });
      expect(postStore.getState().list.find(post => post.id === 2)?.content).toBe("Added content");

      postStore.dispatch("updatePost", { id: 3, content: undefined });
      expect(postStore.getState().list.find(post => post.id === 3)?.content).toBe(undefined);
    });

    it("should handle arrays with partial updates", function () {
      const arrayStore = store({
        state: {
          items: [
            { id: 1, name: "Item 1", details: { color: "red", size: "small" } },
            { id: 2, name: "Item 2", details: { color: "blue", size: "medium" } }
          ]
        },
        name: "array-store"
      });

      arrayStore.defineAction("updateItem", ({ state, payload }) => {
        const itemIndex = state.items.findIndex(item => item.id === payload.id);
        if (itemIndex !== -1) {
          _deepMerge(state.items[itemIndex], payload);
        }
      });

      arrayStore.dispatch("updateItem", { id: 1, details: { size: "large" } });
      expect(arrayStore.state.items[0]).toEqual({
        id: 1,
        name: "Item 1",
        details: { color: "red", size: "large" }
      });
      expect(arrayStore.state.items[1]).toEqual({
        id: 2,
        name: "Item 2",
        details: { color: "blue", size: "medium" }
      });
    });
  });

  describe("State Machine with Partial Updates", function () {
    beforeEach(function() {
      // Reset the store state before each test
      navStore.dispatch("updateNavigation", {
        sidebar: "chat",
        center: "documents",
        topbar: "default"
      });
    });

    it("should toggle center view while preserving other navigation properties", function () {
      // Initial state
      expect(navStore.getState().navigation).toEqual({
        sidebar: "chat",
        center: "documents",
        topbar: "default"
      });

      // Toggle to chat
      navStore.dispatch("navigation:toggle_chat");
      expect(navStore.getState().navigation).toEqual({
        sidebar: "chat",
        center: "chat",
        topbar: "default"
      });

      // Toggle back to document
      navStore.dispatch("navigation:toggle_chat");
      expect(navStore.getState().navigation).toEqual({
        sidebar: "chat",
        center: "documents",
        topbar: "default"
      });
    });

    it("should not change state if transition is invalid", function () {
      // Change center to an invalid state
      navStore.dispatch("updateNavigation", { center: "invalid" });

      // Attempt to toggle chat (should fail)
      navStore.dispatch("navigation:toggle_chat");

      // State should remain unchanged
      expect(navStore.getState().navigation).toEqual({
        sidebar: "chat",
        center: "invalid",
        topbar: "default"
      });
    });

    it("should call onEntry with correct states", function () {
      navStore.dispatch("navigation:toggle_chat");
      expect(navStore.onEntrySpy).toHaveBeenCalledWith(
        { sidebar: "chat", center: "chat", topbar: "default" },
        { sidebar: "chat", center: "documents", topbar: "default" }
      );
    });

    it("should allow changing sidebar independently", function () {
      navStore.dispatch("navigation:CHANGE_SIDEBAR", "settings");
      expect(navStore.getState().navigation).toEqual({
        sidebar: "settings",
        center: "documents",
        topbar: "default"
      });
    });

    it("should allow multiple transitions", function () {
      navStore.dispatch("navigation:toggle_chat");
      navStore.dispatch("navigation:CHANGE_SIDEBAR", "profile");
      expect(navStore.getState().navigation).toEqual({
        sidebar: "profile",
        center: "chat",
        topbar: "default"
      });
    });

    it("should maintain correct state after multiple transitions", function () {
      navStore.dispatch("navigation:toggle_chat");
      navStore.dispatch("navigation:CHANGE_SIDEBAR", "settings");
      navStore.dispatch("navigation:toggle_chat");
      expect(navStore.getState().navigation).toEqual({
        sidebar: "settings",
        center: "documents",
        topbar: "default"
      });
    });
  });
});
