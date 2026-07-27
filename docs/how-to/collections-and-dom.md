# Render collections and access committed DOM

Use lit-html's `repeat()` for collections with stable item keys. Use `afterRender()` when code needs a node that the template just committed.

## Render a stable keyed list

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement, repeat } from 'cami'

    class TodoList extends ReactiveElement {
      todos = [
        { id: 'a', title: 'Read the guide' },
        { id: 'b', title: 'Build an island' },
      ]

      template() {
        return html`
          <ul>
            ${repeat(
              this.todos,
              todo => todo.id,
              todo => html`<li>${todo.title}</li>`,
            )}
          </ul>
        `
      }
    }
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement, repeat } from 'cami'

    interface Todo {
      id: string
      title: string
    }

    class TodoList extends ReactiveElement {
      todos: Todo[] = [
        { id: 'a', title: 'Read the guide' },
        { id: 'b', title: 'Build an island' },
      ]

      template(): ReturnType<typeof html> {
        return html`
          <ul>
            ${repeat(
              this.todos,
              (todo: Todo) => todo.id,
              (todo: Todo) => html`<li>${todo.title}</li>`,
            )}
          </ul>
        `
      }
    }
    ```

The key must be stable for the lifetime of an item. Do not use an array index when items can move, be inserted, or be removed.

## Focus a node after commit

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement } from 'cami'

    class SearchBox extends ReactiveElement {
      template() {
        this.afterRender('initial-focus', () => {
          this.querySelector('[data-role="search"]')?.focus()
        }, [])

        return html`
          <label>
            Search
            <input data-role="search" type="search" />
          </label>
        `
      }
    }
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement } from 'cami'

    class SearchBox extends ReactiveElement {
      template(): ReturnType<typeof html> {
        this.afterRender('initial-focus', () => {
          this.querySelector<HTMLInputElement>('[data-role="search"]')?.focus()
        }, [])

        return html`
          <label>
            Search
            <input data-role="search" type="search" />
          </label>
        `
      }
    }
    ```

The stable effect key identifies the integration. The empty dependency list runs the setup once per connection. A returned cleanup function runs when dependencies change or the element disconnects.

Use semantic attributes such as `data-role` for integration targets. Avoid selectors tied to visual styling.
