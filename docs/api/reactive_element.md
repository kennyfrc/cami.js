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

These APIs run at different lifecycle phases:

| API | Runs | Use it for |
|---|---|---|
| `effect(fn)` | Synchronously when its reactive reads change | Low-level integration that does not need committed DOM |
| `afterRender(key, fn, deps?)` | After this component commits DOM | Focus, measurement, scrolling, positioning, editors, charts, and third-party widgets |
| `afterSettle(source, callback)` | After affected renders and post-render work settle | Watch-like analytics, external synchronization, and guarded follow-up state changes |

There is no separate `commit()` or `watch()` method. Earlier development versions called `afterRender()` a commit effect. `afterSettle()` is the watch-like API in `0.4.0`.

### `effect(fn): void`

Tracks reactive values read by `fn` and reruns it when they change. Cami disposes the effect on disconnect.

Register component effects once, normally in `onConnect()`. Do not create an effect during every `template()` call. Prefer `afterRender()` when the callback reads or changes rendered DOM.

### `derive(fn): T`

Creates a derived reactive value and registers its disposal with the component.

### `afterRender(key, effect, deps?): void`

Declare a keyed commit-phase effect during `template()`. It runs after DOM commit. A returned cleanup runs before the keyed effect reruns, when the key disappears, or when the component disconnects.

The key identifies one post-render responsibility. With no dependency array, the callback runs after every successful render. An empty array runs it once per connection. Other arrays rerun it when an item changes by `Object.is()` comparison.

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
    template(): ReturnType<typeof html> {
      this.afterRender('chart', () => {
        const canvas = this.querySelector<HTMLCanvasElement>('canvas')
        if (!canvas) return
        const chart = createChart(canvas)
        return () => chart.destroy()
      }, [this.dataset.series])

      return html`<canvas></canvas>`
    }
    ```

### `afterSettle(source, callback): void`

Watches a reactive getter. The callback receives the new and previous values after all affected renders and `afterRender` effects settle.

Register a watcher once in `onConnect()`. Its first callback observes the transition from `undefined` to the current value. Cami removes the watcher on disconnect. A callback may update state, but guard the update so it converges; Cami stops continuous settle loops after ten passes.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    onConnect() {
      this.afterSettle(
        () => PreferencesStore.getState().theme,
        (theme, previousTheme) => {
          if (theme !== previousTheme) {
            analytics.track('theme changed', { theme })
          }
        },
      )
    }
    ```

=== "TypeScript"

    ```typescript
    type Theme = 'light' | 'dark'

    onConnect(): void {
      this.afterSettle<Theme>(
        () => PreferencesStore.getState().theme,
        (theme: Theme, previousTheme: Theme | undefined): void => {
          if (theme !== previousTheme) {
            analytics.track('theme changed', { theme })
          }
        },
      )
    }
    ```

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
