# Best Practices

These patterns emerged from real-world experience building complex Cami.js applications. Following them will help you write maintainable, performant code.

## Keep Components Pure

Components should be pure renderers—they read state from stores and dispatch actions, but never hold UI state themselves. All ephemeral state (expanded/collapsed, loading indicators, selection state) belongs in a dedicated store.

**The Problem:** Declaring reactive properties on components creates state that's hard to track across component lifecycles.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Bad: Local reactive state
    class ItemRow extends ReactiveElement {
        expanded = true; // Reactive! Triggers re-renders
        toggleExpanded() {
            this.expanded = !this.expanded; // Mutation scattered in component
        }
        template() {
            return html `
          <div class=${this.expanded ? "open" : ""}>
            <button @click=${() => this.toggleExpanded()}>Toggle</button>
            ${this.expanded ? html `<div>Content</div>` : null}
          </div>
        `;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Bad: Local reactive state
    class ItemRow extends ReactiveElement {
      expanded = true;  // Reactive! Triggers re-renders

      toggleExpanded() {
        this.expanded = !this.expanded;  // Mutation scattered in component
      }

      template() {
        return html`
          <div class=${this.expanded ? "open" : ""}>
            <button @click=${() => this.toggleExpanded()}>Toggle</button>
            ${this.expanded ? html`<div>Content</div>` : null}
          </div>
        `;
      }
    }
    ```

**The Solution:** Move UI state to a dedicated store and use computed getters:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Good: State in store, component is pure
    const UIStore = store({
        name: "UIStore",
        state: { expansionState: {} },
    });
    UIStore.defineAction("setExpanded", ({ state, payload }) => {
        state.expansionState[payload.id] = payload.isExpanded;
    });
    class ItemRow extends ReactiveElement {
        get uniqueId() {
            return `item_${this.itemId}`;
        }
        get isExpanded() {
            const { expansionState } = UIStore.getState();
            const explicitState = expansionState[this.uniqueId];
            // User has explicitly toggled - respect their choice
            if (explicitState !== undefined) {
                return explicitState;
            }
            // Calculate default based on item state
            return !this.item?.completed;
        }
        toggleExpanded() {
            UIStore.dispatch("setExpanded", {
                id: this.uniqueId,
                isExpanded: !this.isExpanded,
            });
        }
        template() {
            // Register store dependency for reactivity
            void UIStore.getState();
            return html `
          <div class=${this.isExpanded ? "open" : ""}>
            <button @click=${() => this.toggleExpanded()}>Toggle</button>
            ${this.isExpanded ? html `<div>Content</div>` : null}
          </div>
        `;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Good: State in store, component is pure
    const UIStore = store({
      name: "UIStore",
      state: { expansionState: {} },
    });

    UIStore.defineAction("setExpanded", ({ state, payload }) => {
      state.expansionState[payload.id] = payload.isExpanded;
    });

    class ItemRow extends ReactiveElement {
      get uniqueId() {
        return `item_${this.itemId}`;
      }

      get isExpanded() {
        const { expansionState } = UIStore.getState();
        const explicitState = expansionState[this.uniqueId];

        // User has explicitly toggled - respect their choice
        if (explicitState !== undefined) {
          return explicitState;
        }

        // Calculate default based on item state
        return !this.item?.completed;
      }

      toggleExpanded() {
        UIStore.dispatch("setExpanded", {
          id: this.uniqueId,
          isExpanded: !this.isExpanded,
        });
      }

      template() {
        // Register store dependency for reactivity
        void UIStore.getState();

        return html`
          <div class=${this.isExpanded ? "open" : ""}>
            <button @click=${() => this.toggleExpanded()}>Toggle</button>
            ${this.isExpanded ? html`<div>Content</div>` : null}
          </div>
        `;
      }
    }
    ```

---

## Centralize All Reactivity in Stores

Stores should be the single source of truth for all reactive behavior. Derive computed values during render rather than caching them in component state.

**Key Principles:**

- Use `getState()` in templates to register store dependencies
- Use getters for computed values that derive from store state
- Use `defineMemo()` for expensive computations that should be cached
- Actions are the only way to modify state

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Store handles all state
    const ItemStore = store({
        name: "ItemStore",
        state: {
            items: [],
            filter: "all",
            expansionState: {},
        },
    });
    // Actions modify state
    ItemStore.defineAction("setFilter", ({ state, payload }) => {
        state.filter = payload;
    });
    ItemStore.defineAction("toggleExpansion", ({ state, payload }) => {
        const current = state.expansionState[payload.id] ?? true;
        state.expansionState[payload.id] = !current;
    });
    // Memos for derived data
    ItemStore.defineMemo("filteredItems", ({ state }) => {
        if (state.filter === "all")
            return state.items;
        return state.items.filter(item => item.status === state.filter);
    });
    // Component just renders
    class ItemList extends ReactiveElement {
        template() {
            const items = ItemStore.memo("filteredItems");
            return html `
          <ul>
            ${items.map(item => html `<item-row .item=${item}></item-row>`)}
          </ul>
        `;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Store handles all state
    const ItemStore = store({
      name: "ItemStore",
      state: {
        items: [],
        filter: "all",
        expansionState: {},
      },
    });

    // Actions modify state
    ItemStore.defineAction("setFilter", ({ state, payload }) => {
      state.filter = payload;
    });

    ItemStore.defineAction("toggleExpansion", ({ state, payload }) => {
      const current = state.expansionState[payload.id] ?? true;
      state.expansionState[payload.id] = !current;
    });

    // Memos for derived data
    ItemStore.defineMemo("filteredItems", ({ state }) => {
      if (state.filter === "all") return state.items;
      return state.items.filter(item => item.status === state.filter);
    });

    // Component just renders
    class ItemList extends ReactiveElement {
      template() {
        const items = ItemStore.memo("filteredItems");
        return html`
          <ul>
            ${items.map(item => html`<item-row .item=${item}></item-row>`)}
          </ul>
        `;
      }
    }
    ```

---

## Never Use `effect()`

The `effect()` method creates reactive side effects that run when dependencies change. This pattern leads to:

- Reactive cycles and stack overflows
- State mutations scattered across components
- Unpredictable render timing

**The Problem:**

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Bad: Creates reactive cycle
    class ItemRow extends ReactiveElement {
        expanded = true;
        onConnect() {
            this.effect(() => {
                if (this.item?.completed) {
                    this.expanded = false; // Mutating reactive state in effect!
                }
            });
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Bad: Creates reactive cycle
    class ItemRow extends ReactiveElement {
      expanded = true;

      onConnect() {
        this.effect(() => {
          if (this.item?.completed) {
            this.expanded = false;  // Mutating reactive state in effect!
          }
        });
      }
    }
    ```

**The Solution:** Use computed getters that derive state purely:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Good: Pure computation, no side effects
    class ItemRow extends ReactiveElement {
        get isExpanded() {
            const { expansionState } = UIStore.getState();
            const explicitState = expansionState[this.uniqueId];
            if (explicitState !== undefined)
                return explicitState;
            // Calculate default based on data state
            if (this.item?.completed)
                return false;
            return true;
        }
        template() {
            void UIStore.getState(); // Register dependency
            return html `<div class=${this.isExpanded ? "open" : ""}">...</div>`;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Good: Pure computation, no side effects
    class ItemRow extends ReactiveElement {
      get isExpanded() {
        const { expansionState } = UIStore.getState();
        const explicitState = expansionState[this.uniqueId];

        if (explicitState !== undefined) return explicitState;

        // Calculate default based on data state
        if (this.item?.completed) return false;
        return true;
      }

      template() {
        void UIStore.getState();  // Register dependency
        return html`<div class=${this.isExpanded ? "open" : ""}">...</div>`;
      }
    }
    ```

---

## Minimize `afterRender()`

Declare `afterRender(key, effect, deps)` inside `template()` when work must happen after DOM commit. Stable keys and dependency arrays control reruns. A returned cleanup runs before the effect reruns or when the component disconnects.

**When `afterRender()` is appropriate:**

- Integrating with non-Cami libraries that need DOM references
- Measuring DOM elements for layout calculations
- Focus management after renders

**When to avoid:**

- Setting component state (use stores instead)
- Running business logic (use actions instead)
- Subscribing to external data (use queries instead)

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Appropriate: Chart library needs DOM element
    class ChartElement extends ReactiveElement {
        template() {
            this.afterRender('chart', () => {
                const chartEl = this.querySelector('.chart');
                const chart = new ExternalChart(chartEl, this.getChartOptions());
                return () => chart.destroy();
            }, [this.data]);
            return html `<div class="chart"></div>`;
        }
    }
    // Avoid: Setting state in afterRender
    class BadComponent extends ReactiveElement {
        template() {
            this.afterRender('derive-state', () => {
                this.hasItems = this.items?.length > 0; // Causes another render
            });
            return html `...`;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Appropriate: Chart library needs DOM element
    class ChartElement extends ReactiveElement {
      template() {
        this.afterRender('chart', () => {
          const chartEl = this.querySelector('.chart');
          const chart = new ExternalChart(chartEl, this.getChartOptions());
          return () => chart.destroy();
        }, [this.data]);

        return html`<div class="chart"></div>`;
      }
    }

    // Avoid: Setting state in afterRender
    class BadComponent extends ReactiveElement {
      template() {
        this.afterRender('derive-state', () => {
          this.hasItems = this.items?.length > 0; // Causes another render
        });
        return html`...`;
      }
    }
    ```

---

## Never Fetch Data in `onConnect()`

Components should not trigger data fetching in their lifecycle methods. Data fetching should happen at the **application level**—either during bootstrap or via URL-based routing.

**The Problem:**

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Bad: Fetching data in component lifecycle
    class PostsList extends ReactiveElement {
        onConnect() {
            PostsStore.query("posts:fetch"); // Runs every time component mounts!
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Bad: Fetching data in component lifecycle
    class PostsList extends ReactiveElement {
      onConnect() {
        PostsStore.query("posts:fetch");  // Runs every time component mounts!
      }
    }
    ```

This causes:
- Duplicate fetches when components remount
- Race conditions with multiple components
- Unclear data flow (who fetches what?)

**The Solution:** Fetch data at the application level:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Good: Bootstrap fetches initial data once
    async function bootstrapApp() {
        await PostsStore.query("posts:fetch");
    }
    bootstrapApp();
    // Good: URL routing triggers data fetching
    router.registerRoute("/posts", {
        onEnter: async () => {
            await PostsStore.query("posts:fetch");
        },
    });
    // Good: User action triggers fetch
    class PostsList extends ReactiveElement {
        template() {
            const { posts } = PostsStore.getState();
            return html `
          <button @click=${() => PostsStore.query("posts:fetch")}>Refresh</button>
          ${this.renderPosts(posts)}
        `;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Good: Bootstrap fetches initial data once
    async function bootstrapApp() {
      await PostsStore.query("posts:fetch");
    }
    bootstrapApp();

    // Good: URL routing triggers data fetching
    router.registerRoute("/posts", {
      onEnter: async () => {
        await PostsStore.query("posts:fetch");
      },
    });

    // Good: User action triggers fetch
    class PostsList extends ReactiveElement {
      template() {
        const { posts } = PostsStore.getState();
        return html`
          <button @click=${() => PostsStore.query("posts:fetch")}>Refresh</button>
          ${this.renderPosts(posts)}
        `;
      }
    }
    ```

---

## Avoid Reactive Guards in `connectedCallback()`

The `connectedCallback()` lifecycle method fires when the element is added to the DOM. At this point, property bindings from parent components may not be set yet.

**The Problem:**

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Bad: Props may not be set yet
    class ItemRow extends ReactiveElement {
        onConnect() {
            if (this.item?.type === "special") {
                this.expanded = false; // this.item might be undefined!
            }
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Bad: Props may not be set yet
    class ItemRow extends ReactiveElement {
      onConnect() {
        if (this.item?.type === "special") {
          this.expanded = false;  // this.item might be undefined!
        }
      }
    }
    ```

**The Solution:** Compute state during render when props are guaranteed to be available:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Good: Computed during render
    class ItemRow extends ReactiveElement {
        get isExpanded() {
            // Props are guaranteed to be set by render time
            if (this.item?.type === "special")
                return false;
            return true;
        }
        template() {
            return html `
          <div class=${this.isExpanded ? "open" : ""}>
            ${this.renderContent()}
          </div>
        `;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Good: Computed during render
    class ItemRow extends ReactiveElement {
      get isExpanded() {
        // Props are guaranteed to be set by render time
        if (this.item?.type === "special") return false;
        return true;
      }

      template() {
        return html`
          <div class=${this.isExpanded ? "open" : ""}>
            ${this.renderContent()}
          </div>
        `;
      }
    }
    ```

---

## Template Logic Ordering

For components with multiple visual states, the order of conditional checks in `template()` is critical. Check for terminal/complete states first, then intermediate states, then fall back to defaults.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class AsyncItem extends ReactiveElement {
        template() {
            // 1. Register store dependency
            void ItemStore.getState();
            const expanded = this.isExpanded;
            const hasResult = Boolean(this.item?.result);
            const isLoading = Boolean(this.item?.loading);
            // 2. CHECK FOR RESULT FIRST (Complete State)
            if (hasResult) {
                return this.renderComplete(expanded);
            }
            // 3. CHECK FOR LOADING (Intermediate State)
            if (isLoading || this.item?.type === "async") {
                return this.renderLoading();
            }
            // 4. GENERIC FALLBACK
            return this.renderDefault();
        }
        renderComplete(expanded) {
            return html `
          <div class=${expanded ? "open" : ""}>
            <div class="result">${this.item.result}</div>
          </div>
        `;
        }
        renderLoading() {
            return html `<div class="loading">Loading...</div>`;
        }
        renderDefault() {
            return html `<div class="placeholder">No data</div>`;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    class AsyncItem extends ReactiveElement {
      template() {
        // 1. Register store dependency
        void ItemStore.getState();

        const expanded = this.isExpanded;
        const hasResult = Boolean(this.item?.result);
        const isLoading = Boolean(this.item?.loading);

        // 2. CHECK FOR RESULT FIRST (Complete State)
        if (hasResult) {
          return this.renderComplete(expanded);
        }

        // 3. CHECK FOR LOADING (Intermediate State)
        if (isLoading || this.item?.type === "async") {
          return this.renderLoading();
        }

        // 4. GENERIC FALLBACK
        return this.renderDefault();
      }

      renderComplete(expanded) {
        return html`
          <div class=${expanded ? "open" : ""}>
            <div class="result">${this.item.result}</div>
          </div>
        `;
      }

      renderLoading() {
        return html`<div class="loading">Loading...</div>`;
      }

      renderDefault() {
        return html`<div class="placeholder">No data</div>`;
      }
    }
    ```

---

## Parent Component Responsibilities

Parent components must pass identity props that child components need to generate unique keys for store lookups:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Parent component
    class ItemList extends ReactiveElement {
        template() {
            const items = ItemStore.getState().items;
            return html `
          <div>
            ${items.map((item, index) => html `
              <item-row
                .item=${item}
                .parentId=${this.id}
                .itemIndex=${index}
              ></item-row>
            `)}
          </div>
        `;
        }
    }
    // Child component uses passed props for unique ID
    class ItemRow extends ReactiveElement {
        get uniqueId() {
            return `${this.parentId}_item_${this.itemIndex}`;
        }
        get isExpanded() {
            const { expansionState } = UIStore.getState();
            return expansionState[this.uniqueId] ?? true;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    // Parent component
    class ItemList extends ReactiveElement {
      template() {
        const items = ItemStore.getState().items;
        return html`
          <div>
            ${items.map((item, index) => html`
              <item-row
                .item=${item}
                .parentId=${this.id}
                .itemIndex=${index}
              ></item-row>
            `)}
          </div>
        `;
      }
    }

    // Child component uses passed props for unique ID
    class ItemRow extends ReactiveElement {
      get uniqueId() {
        return `${this.parentId}_item_${this.itemIndex}`;
      }

      get isExpanded() {
        const { expansionState } = UIStore.getState();
        return expansionState[this.uniqueId] ?? true;
      }
    }
    ```

---

## Store Organization Patterns

### Single Root Store

Best for small to medium applications:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const AppStore = store({
        name: "AppStore",
        state: {
            user: null,
            ui: { theme: "light", sidebarOpen: false },
            data: { posts: [], comments: [] },
        },
    });
    ```

=== "TypeScript"

    ```typescript
    const AppStore = store({
      name: "AppStore",
      state: {
        user: null,
        ui: { theme: "light", sidebarOpen: false },
        data: { posts: [], comments: [] },
      },
    });
    ```

### Domain-Specific Stores

Better for larger applications:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const UserStore = store({
        name: "UserStore",
        state: { user: null, preferences: {} },
    });
    const PostsStore = store({
        name: "PostsStore",
        state: { posts: [], comments: [] },
    });
    const UIStore = store({
        name: "UIStore",
        state: { theme: "light", expansionState: {} },
    });
    ```

=== "TypeScript"

    ```typescript
    const UserStore = store({
      name: "UserStore",
      state: { user: null, preferences: {} },
    });

    const PostsStore = store({
      name: "PostsStore",
      state: { posts: [], comments: [] },
    });

    const UIStore = store({
      name: "UIStore",
      state: { theme: "light", expansionState: {} },
    });
    ```

### Naming Conventions

- **Store names**: PascalCase with "Store" suffix (`CartStore`, `UIStore`)
- **Action names**: namespace:verb format (`posts:fetch`, `cart:add`, `ui:toggle`)
- **Query names**: namespace:verb format (`posts:fetchAll`, `user:fetchById`)
- **Memo names**: namespace:derivedValue format (`cart:totalPrice`, `posts:filteredList`)

---

## Summary

| Do | Don't |
|----|-------|
| Keep components pure (render + dispatch) | Store UI state in components |
| Centralize state in stores | Mirror store state in component props |
| Fetch data in bootstrap or URL routing | Fetch data in `onConnect()` |
| Use getters for derived values | Use `effect()` for derived state |
| Use `defineMemo()` for expensive computations | Compute expensive values in render |
| Check complete states first in templates | Assume prop order in lifecycle hooks |
| Pass identity props to children | Rely on implicit context |
| Use `afterRender()` only for DOM integration | Set state in `afterRender()` |
