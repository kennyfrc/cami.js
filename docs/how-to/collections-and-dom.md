# Render collections and access DOM nodes

Use `keyedRepeat()` when a list can be inserted, removed, or reordered. Use `ref()` when post-render code needs a specific DOM node.

## Render a stable keyed list

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, keyedRepeat, ReactiveElement } from 'cami'

    class TodoList extends ReactiveElement {
      todos = [
        { id: 'a', title: 'Read the guide' },
        { id: 'b', title: 'Build an island' },
      ]

      template() {
        return html`
          <ul>
            ${keyedRepeat(
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
    import { html, keyedRepeat, ReactiveElement } from 'cami'

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
            ${keyedRepeat(
              this.todos,
              (todo: Todo) => todo.id,
              (todo: Todo) => html`<li>${todo.title}</li>`,
            )}
          </ul>
        `
      }
    }
    ```

Keys must be non-empty strings and unique within the collection. In debug mode, `keyedRepeat()` warns about unstable keys.

## Hold a DOM reference

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ref, ReactiveElement } from 'cami'

    class SearchBox extends ReactiveElement {
      inputRef: { current: HTMLInputElement | null } = { current: null }

      template(): ReturnType<typeof html> {
        this.afterRender('initial-focus', () => {
          this.inputRef.current?.focus()
        }, [])

        return html`
          <label>
            Search
            <input ${ref(this.inputRef)} type="search" />
          </label>
        `
      }
    }
    ```

=== "TypeScript"

    ```typescript
    import { html, ref, ReactiveElement } from 'cami'

    class SearchBox extends ReactiveElement {
      inputRef = { current: null }

      template() {
        this.afterRender('initial-focus', () => {
          this.inputRef.current?.focus()
        }, [])

        return html`
          <label>
            Search
            <input ${ref(this.inputRef)} type="search" />
          </label>
        `
      }
    }
    ```

Declare `afterRender()` while rendering. Its stable key identifies the effect. The empty dependency array runs it once for the mounted effect, and any cleanup function it returns runs when the effect changes or the element disconnects.

## Use callback refs

`ref()` also accepts a callback:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    <canvas ${ref(node => { this.canvas = node })}></canvas>
    ```

=== "TypeScript"

    ```typescript
    <canvas ${ref((node: HTMLCanvasElement | null) => { this.canvas = node })}></canvas>
    ```

The callback receives the element and later receives `null` when lit-html clears the part.
