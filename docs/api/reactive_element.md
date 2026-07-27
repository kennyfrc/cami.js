# `ReactiveElement`

`ReactiveElement` extends `HTMLElement`. Fields assigned on a connected subclass instance become reactive, and state reads during `template()` establish dependencies.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement } from 'cami';
    class StatusBadge extends ReactiveElement {
        status = 'ready';
        template() {
            return html `<span>${this.status}</span>`;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement } from 'cami'

    class StatusBadge extends ReactiveElement {
      status: 'ready' | 'busy' = 'ready'

      template() {
        return html`<span>${this.status}</span>`
      }
    }
    ```

## Rendering

### `template(): TemplateResult`

Override `template()` and return an `html` or `svg` result. Keep rendering pure: read state and describe UI. Move writes, fetches, focus, measurements, and third-party integration outside the render phase.

### `render(): void`

Runs `template()` and commits changed parts. Cami calls this as dependencies change. Direct calls are rarely needed.

### `static nonReactiveProperties`

List internal fields that Cami must not convert into reactive properties:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class ChartView extends ReactiveElement {
        static nonReactiveProperties = ['chart'];
        chart = null;
    }
    ```

=== "TypeScript"

    ```typescript
    class ChartView extends ReactiveElement {
      static nonReactiveProperties = ['chart']
      chart: ExternalChart | null = null
    }
    ```

The list is inherited and merged across subclasses.

## Component effects

### `effect(fn): void`

Tracks reactive values read by `fn` and reruns it when they change. Cami disposes the effect on disconnect.

### `derive(fn): T`

Creates a derived reactive value and registers its disposal with the component.

### `afterRender(key, effect, deps?): void`

Declare a keyed commit-phase effect during `template()`. It runs after DOM commit. A returned cleanup runs before the keyed effect reruns, when the key disappears, or when the component disconnects.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    template() {
      this.afterRender('chart', () => {
        const chart = createChart(this.querySelector('canvas'))
        return () => chart.destroy()
      }, [this.dataset.series])

      return html`<canvas></canvas>`
    }
    ```

=== "TypeScript"

    ```typescript
    template() {
      this.afterRender('chart', () => {
        const chart = createChart(this.querySelector('canvas'))
        return () => chart.destroy()
      }, [this.dataset.series])

      return html`<canvas></canvas>`
    }
    ```

### `afterSettle(source, callback): void`

Watches a reactive getter. The callback receives the new and previous values after all affected renders and `afterRender` effects settle.

## Component resources

### `resource(key, loader, options?): Resource<T>`

Creates or retrieves a component-owned async state machine. The loader receives an `AbortSignal`.

Options:

| Option | Type | Meaning |
| --- | --- | --- |
| `keepPrevious` | `boolean` | Keep previous data while refreshing |
| `dedupeMs` | `number` | Suppress starts inside the interval |
| `race` | `'latest' \| 'first'` | Abort older work or keep the first in-flight request |

### `ephemeral(key, init, options?): T`

Returns component-local keyed state. Options are `ttlMs` and `resetOnDisconnect`.

### `setEphemeral(key, value): void`

Updates an ephemeral entry and schedules dependents.

## Attributes

### `observableAttributes(map): void`

Converts selected attributes into reactive properties, optionally parsing their string values.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    onCreate() {
      this.observableAttributes({
        count: value => Number(value),
        items: value => JSON.parse(value),
      })
    }
    ```

=== "TypeScript"

    ```typescript
    onCreate() {
      this.observableAttributes({
        count: value => Number(value),
        items: value => JSON.parse(value),
      })
    }
    ```

### `warnIfMissingProperties(names): void`

Logs a warning for property names not present on the element.

## Lifecycle hooks

Override these no-op hooks rather than replacing the platform callbacks:

| Hook | Runs when |
| --- | --- |
| `onCreate()` | The element is constructed |
| `onConnect()` | The element connects to a document |
| `onDisconnect()` | The element disconnects |
| `onAttributeChange(name, oldValue, newValue)` | An observed attribute changes |
| `onAdopt()` | The element moves to another document |

Cami's platform callbacks perform rendering and cleanup before or around these hooks.
