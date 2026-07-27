# Persist store state in localStorage

Cami provides one browser persistence adapter: versioned localStorage. Use it for small, non-secret preferences and drafts that should survive a reload.

Do not persist authentication tokens or sensitive user data. Browser storage is readable by scripts running on the same origin.

## Create and hydrate a store

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createLocalStorage, persistToLocalStorageThunk, store } from 'cami'

    const PreferencesStore = store({
      name: 'preferences',
      state: { theme: 'system', density: 'comfortable' },
    })

    PreferencesStore.defineAction('hydrate', ({ state, payload }) => {
      Object.assign(state, payload)
    })

    const storage = createLocalStorage({ name: 'preferences', version: 1 })
    const saved = await storage.getState()
    if (saved) PreferencesStore.dispatch('hydrate', saved)

    PreferencesStore.afterHook(persistToLocalStorageThunk(storage))
    ```

=== "TypeScript"

    ```typescript
    import { createLocalStorage, persistToLocalStorageThunk, store } from 'cami'

    type Theme = 'light' | 'dark' | 'system'
    type Density = 'comfortable' | 'compact'

    interface PreferencesState {
      theme: Theme
      density: Density
    }

    const PreferencesStore = store<PreferencesState>({
      name: 'preferences',
      state: { theme: 'system', density: 'comfortable' },
    })

    PreferencesStore.defineAction('hydrate', ({ state, payload }) => {
      Object.assign(state, payload as Partial<PreferencesState>)
    })

    const storage = createLocalStorage<PreferencesState>({ name: 'preferences', version: 1 })
    const saved = await storage.getState()
    if (saved) PreferencesStore.dispatch('hydrate', saved)

    PreferencesStore.afterHook(persistToLocalStorageThunk(storage))
    ```

Hydrate before components depend on the store. Then attach the persistence hook. This avoids a startup rewrite.

## Version behavior

`createLocalStorage({ name, version })` records the version beside the stored value.

- The first version creates a storage record.
- The same version reuses the record.
- A higher version clears the old value.

Increment the version when the stored shape is incompatible. A version change clears the old value. For migration, read and transform the old record before creating the new adapter.

## Keep persisted state small

The built-in hook writes the complete store after a transition. Keep persisted preferences in a small store. Do not persist a large application store.

For large collections, offline databases, or cross-tab coordination, use an application-owned adapter. Those concerns need domain-specific indexes, migrations, conflict behavior, and failure handling, so they are outside Cami's core API.

## API

| Export | Purpose |
| --- | --- |
| `createLocalStorage({ name, version })` | Read and write one versioned JSON value |
| `persistToLocalStorageThunk(adapter)` | Create an `afterHook` that writes changed store state |
