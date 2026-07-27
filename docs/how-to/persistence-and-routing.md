# Persist state and route by URL

Persistence and routing are independent browser integrations. Add them only where the state has to survive a reload or be represented by a shareable URL.

## Persist a store to localStorage

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createLocalStorage, persistToLocalStorageThunk, store } from 'cami'

    const PreferencesStore = store({
      name: 'preferences',
      state: { theme: 'system' },
    })

    PreferencesStore.defineAction('hydrate', ({ state, payload }) => {
      Object.assign(state, payload)
    })

    const storage = createLocalStorage({ name: 'preferences', version: 1 })
    PreferencesStore.afterHook(persistToLocalStorageThunk(storage))

    const saved = await storage.getState()
    if (saved) PreferencesStore.dispatch('hydrate', saved)
    ```

=== "TypeScript"

    ```typescript
    import { createLocalStorage, persistToLocalStorageThunk, store } from 'cami'

    type Theme = 'light' | 'dark' | 'system'

    interface PreferencesState {
      theme: Theme
    }

    const PreferencesStore = store<PreferencesState>({
      name: 'preferences',
      state: { theme: 'system' },
    })

    PreferencesStore.defineAction('hydrate', ({ state, payload }) => {
      Object.assign(state, payload as Partial<PreferencesState>)
    })

    const storage = createLocalStorage<PreferencesState>({ name: 'preferences', version: 1 })
    PreferencesStore.afterHook(persistToLocalStorageThunk(storage))

    const saved = await storage.getState()
    if (saved !== null) PreferencesStore.dispatch('hydrate', saved)
    ```

Use a versioned storage name or migration strategy when the persisted state shape changes. Do not persist secrets or authentication tokens in browser storage.

For larger collections or offline databases, use an application-owned adapter with explicit indexes, migrations, and error handling. Cami keeps only the small localStorage case in its core API.

## Create a hash router

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createURLStore } from 'cami'

    const router = createURLStore()

    router
      .registerRoute('/')
      .registerRoute('/projects/:id')

    router.navigate({ path: '/projects/42' })
    ```

=== "TypeScript"

    ```typescript
    import { createURLStore, type NavigateOptions } from 'cami'

    const router = createURLStore()

    router
      .registerRoute('/')
      .registerRoute('/projects/:id')

    const destination: NavigateOptions = { path: '/projects/42' }
    router.navigate(destination)
    ```

`createURLStore()` returns a singleton. Route state is observable, and route definitions can add navigation hooks and resource loaders. Use the [URLStore reference](../api/url_store.md) for the exact route and navigation shapes.
