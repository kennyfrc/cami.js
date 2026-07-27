# URLStore

`URLStore` turns the hash portion of the browser URL into reactive application state. It is useful when one island owns navigation inside an otherwise server-rendered application.

Use it for state that should survive reloads, browser history, copied links, or back/forward navigation. Common examples include an active conversation, selected document, open overlay, workspace tab, and filtered view.

## URL model

Cami parses this URL:

```text
#chats/42?tab=documents#preview=page-2
```

into:

```text
hashPaths  = ["chats", "42"]
params     = { tab: "documents" }
hashParams = { preview: "page-2" }
```

When a registered route contains path parameters, `routeParams` contains the extracted values.

## Create and initialize the store

`createURLStore()` returns one shared instance. Register routes, loaders, and hooks before calling `initialize()` once during application startup.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore } from "cami";

    const router = createURLStore({
      onChange: state => {
        console.log("URL changed", state);
      },
    });

    router.registerRoute("chats/:id");
    await router.initialize();
    ```

=== "TypeScript"

    ```typescript
    import { createURLStore, type URLState } from "cami";

    const router = createURLStore({
      onChange: (state: URLState): void => {
        console.log("URL changed", state);
      },
    });

    router.registerRoute("chats/:id");
    await router.initialize();
    ```

`onInit` is an alias for initial bootstrap work. For fluent setup, use `bootstrap()` instead.

## Register routes and load their data

Route resources run in parallel before `onEnter`. Loaders receive route and query parameters together, plus an `AbortSignal`. A newer navigation aborts loaders from the older navigation.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router
      .registerRoute("chats/:id", {
        resources: ["conversation"],
        onEnter: ({ params }) => {
          console.log("Opened conversation", params.id);
        },
      })
      .registerResourceLoader("conversation", async ({ params, signal }) => {
        const response = await fetch(`/api/conversations/${params.id}`, { signal });
        if (!response.ok) throw new Error("Conversation request failed");
        ConversationStore.dispatch("setConversation", await response.json());
      });
    ```

=== "TypeScript"

    ```typescript
    import type { ResourceLoaderContext, RouteEnterContext } from "cami";

    interface Conversation {
      id: string;
      title: string;
    }

    router
      .registerRoute("chats/:id", {
        resources: ["conversation"],
        onEnter: ({ params }: RouteEnterContext): void => {
          console.log("Opened conversation", params.id);
        },
      })
      .registerResourceLoader(
        "conversation",
        async ({ params, signal }: ResourceLoaderContext): Promise<void> => {
          const response = await fetch(`/api/conversations/${params.id}`, { signal });
          if (!response.ok) throw new Error("Conversation request failed");
          const conversation = await response.json() as Conversation;
          ConversationStore.dispatch("setConversation", conversation);
        },
      );
    ```

### Route options

| Option | Meaning |
|---|---|
| `resources` | Loader names that must finish before route entry |
| `params` | Query-parameter settings; `{ persist: true }` preserves that parameter during `fullReplace` navigation into this route |
| `onEnter` | Runs after resources load and the route becomes active |
| `onLeave` | Runs before the next route becomes active |

Missing resource loaders are ignored. Loader errors are logged and stop that navigation from entering the route.

## Navigate

Path navigation performs the full route lifecycle. Existing parameters remain unless you remove them or request `fullReplace`.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.navigate({
      path: "chats/42",
      params: { tab: "documents" },
      hashParams: { preview: "page-2" },
      pageTitle: "Conversation · Cami",
      announcement: "Opened conversation 42",
      focusSelector: "main h1",
    });

    // Remove one parameter without clearing the others.
    router.navigate({ params: { tab: null } });

    // Replace the current history entry instead of adding one.
    router.navigate({ path: "chats/42", replace: true });
    ```

=== "TypeScript"

    ```typescript
    import type { NavigateOptions } from "cami";

    const destination: NavigateOptions = {
      path: "chats/42",
      params: { tab: "documents" },
      hashParams: { preview: "page-2" },
      pageTitle: "Conversation · Cami",
      announcement: "Opened conversation 42",
      focusSelector: "main h1",
    };

    router.navigate(destination);
    router.navigate({ params: { tab: null } });
    router.navigate({ path: "chats/42", replace: true });
    ```

### Navigation options

| Option | Meaning |
|---|---|
| `path` | New hash path |
| `params` | Query parameters; `null` or `undefined` removes a key |
| `hashParams` | Parameters after the second `#` |
| `fullReplace` | Clear existing parameters except target-route parameters marked persistent |
| `replace` | Use `history.replaceState()` instead of `pushState()` |
| `shallow` | Update `params` and subscribers without running routes or loaders |
| `focusSelector` | Focus an element after navigation |
| `pageTitle` | Set `document.title` |
| `announcement` | Write a message to `#liveRegion` |
| `updateCurrentPage` | Update matching navigation links with `aria-current="page"` |

## Use shallow updates for view state

Shallow navigation is designed for query state inside the current route: selected tabs, panels, filters, sort order, and overlay state. It updates the URL store immediately but skips route matching, resource loading, and entry hooks.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.navigate({
      params: { tab: "documents", document: "doc-7" },
      shallow: true,
      replace: true,
    });
    ```

=== "TypeScript"

    ```typescript
    const viewState: NavigateOptions = {
      params: { tab: "documents", document: "doc-7" },
      shallow: true,
      replace: true,
    };

    router.navigate(viewState);
    ```

`shallow: true` cannot be combined with `path`, `hashParams`, or `fullReplace`. Use normal navigation when the route or its resources must change.

## Guard and observe navigation

A `beforeNavigate` hook cancels navigation only when it returns `false`. Returning `undefined` allows navigation. The `from` state is the previous committed URL state; `to` is the candidate state.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.beforeNavigate(({ to, route }) => {
      if (route?.pattern.startsWith("admin") && !SessionStore.getState().user) {
        router.navigate({ path: "login", replace: true });
        return false;
      }

      return true;
    });

    router.afterNavigate(({ from, to }) => {
      analytics.track("navigation", { from, to });
      window.scrollTo(0, 0);
    });
    ```

=== "TypeScript"

    ```typescript
    import type { NavigationHookContext } from "cami";

    router.beforeNavigate(({ route }: NavigationHookContext): boolean => {
      if (route?.pattern.startsWith("admin") && !SessionStore.getState().user) {
        router.navigate({ path: "login", replace: true });
        return false;
      }

      return true;
    });

    router.afterNavigate(({ from, to }: NavigationHookContext): void => {
      analytics.track("navigation", { from, to });
      window.scrollTo(0, 0);
    });
    ```

Calling `navigate()` inside a pending hook queues that navigation. Return `false` when the queued navigation replaces the current candidate.

## Read and match state

`getState()` is dependency-tracked when called while a reactive component renders.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const state = router.getState();
    const isConversation = router.matches({ hashPaths: ["chats"] });
    const isDocumentsTab = router.matches({ params: { tab: "documents" } });
    const route = router.getActiveRoute();

    console.log(state.routeParams?.id, isConversation, isDocumentsTab, route?.pattern);
    ```

=== "TypeScript"

    ```typescript
    import type { RouteDefinition, URLState } from "cami";

    const state: URLState = router.getState();
    const isConversation: boolean = router.matches({ hashPaths: ["chats"] });
    const isDocumentsTab: boolean = router.matches({ params: { tab: "documents" } });
    const route: RouteDefinition | null = router.getActiveRoute();

    console.log(state.routeParams?.id, isConversation, isDocumentsTab, route?.pattern);
    ```

`matches()` accepts a partial `URLState`. `hashPaths` uses prefix matching; parameter objects match only the keys you provide.

## Navigation status

- `isPending()` is true while hooks, loaders, and route handlers are running.
- `isLoading()` is true only while route resources are loading.
- `isEmpty()` is true when the hash path and both parameter maps are empty.

Status methods are snapshots, not reactive subscriptions. Read URL state during rendering or subscribe to the store when the UI must update.

## Bootstrap application state

Use `bootstrap()` for work that must finish before the first route runs, such as restoring a session or loading feature flags.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    router.bootstrap(async () => {
      const response = await fetch("/api/session");
      SessionStore.dispatch("setSession", await response.json());
    });

    await router.initialize();
    ```

=== "TypeScript"

    ```typescript
    interface Session {
      userId: string | null;
    }

    router.bootstrap(async (): Promise<void> => {
      const response = await fetch("/api/session");
      const session = await response.json() as Session;
      SessionStore.dispatch("setSession", session);
    });

    await router.initialize();
    ```

`bootstrap()` must be registered before `initialize()`. Repeated calls to `initialize()` do nothing.

## Recommended ownership

Create the URL store in one routing module. That module should own route registration, resource loading, redirects, and global hooks. Components can read state and call `navigate()`, but route definitions should not be scattered across component classes.
