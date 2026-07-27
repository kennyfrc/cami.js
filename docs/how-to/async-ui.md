# Load async UI resources

Use a component resource when one element owns the request and its lifecycle. Use a store query when several elements share cached server data.

!!! info "Public example API"
    The worked examples use `https://cami-api.exe.xyz`. It is a public, CORS-enabled mock service for Cami tutorials, not a production data store. It exposes `/posts`, `/todos`, `/products`, and `/users`; list routes support `_limit`, `_start`, and exact-field filters. Check availability at [`/health`](https://cami-api.exe.xyz/health).

## Load component-owned data

Call `resource()` during `template()` with a stable key:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement } from 'cami'

    class UserBadge extends ReactiveElement {
      userId = '42'

      template() {
        const user = this.resource(
          `user:${this.userId}`,
          signal => fetch(`/api/users/${this.userId}`, { signal }).then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response.json()
          }),
          { keepPrevious: true, race: 'latest' },
        )

        if (user.status === 'idle' || user.status === 'loading') {
          return html`<p>Loading…</p>`
        }
        if (user.status === 'error') {
          return html`<p role="alert">Could not load the user.</p>`
        }
        return html`<strong>${user.data.name}</strong>`
      }
    }
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement } from 'cami'

    interface User {
      id: string
      name: string
    }

    class UserBadge extends ReactiveElement {
      userId: string = '42'

      template(): ReturnType<typeof html> {
        const user = this.resource<User>(
          `user:${this.userId}`,
          async (signal: AbortSignal): Promise<User> => {
            const response = await fetch(`/api/users/${this.userId}`, { signal })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return await response.json() as User
          },
          { keepPrevious: true, race: 'latest' },
        )

        if (user.status === 'idle' || user.status === 'loading') {
          return html`<p>Loading…</p>`
        }
        if (user.status === 'error') {
          return html`<p role="alert">Could not load the user.</p>`
        }
        return html`<strong>${user.data.name}</strong>`
      }
    }
    ```

The state is a discriminated union with `idle`, `loading`, `refreshing`, `success`, and `error` statuses. Cami aborts active loaders when the element disconnects.

## Load an image before displaying it

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement, useImage } from 'cami'

    class AvatarImage extends ReactiveElement {
      src: string = '/avatars/current-user.webp'

      template(): ReturnType<typeof html> {
        const image = useImage(this, this.src)
        if (image.status !== 'success') return html`<span>Loading avatar…</span>`
        return html`<img src=${image.data.src} width=${image.data.width} alt="Current user" />`
      }
    }
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement, useImage } from 'cami'

    class AvatarImage extends ReactiveElement {
      src = '/avatars/current-user.webp'

      template() {
        const image = useImage(this, this.src)
        if (image.status !== 'success') return html`<span>Loading avatar…</span>`
        return html`<img src=${image.data.src} width=${image.data.width} alt="Current user" />`
      }
    }
    ```

## Use a shared store query

Define shared queries once, then execute them by name:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const UsersStore = store({ name: 'users', state: { users: [] } })

    UsersStore.defineAction('replace', ({ state, payload }) => {
      state.users = payload
    })

    UsersStore.defineQuery('users:list', {
      queryKey: ['users'],
      queryFn: () => fetch('https://cami-api.exe.xyz/users').then(response => response.json()),
      onSuccess: ({ data, dispatch }) => dispatch('replace', data),
    })

    await UsersStore.query('users:list')
    ```

=== "TypeScript"

    ```typescript
    interface User {
      id: number
      name: string
      email: string
    }

    interface UsersState {
      users: User[]
    }

    const UsersStore = store<UsersState>({ name: 'users', state: { users: [] } })

    UsersStore.defineAction('replace', ({ state, payload }) => {
      state.users = payload as User[]
    })

    UsersStore.defineQuery<void, User[]>('users:list', {
      queryKey: ['users'],
      queryFn: async (): Promise<User[]> => {
        const response = await fetch('https://cami-api.exe.xyz/users')
        return await response.json() as User[]
      },
      onSuccess: ({ data, dispatch }) => dispatch('replace', data),
    })

    await UsersStore.query<User[]>('users:list')
    ```

See the [ObservableStore reference](../api/observable_store.md) for cache, retry, invalidation, and mutation options.
