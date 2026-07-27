import { ref as litRef } from 'lit-html/directives/ref.js'

export type Ref<T extends Element = Element> = { current: T | null }

type RefCallback<T extends Element = Element> = (value: T | null) => void

function isRefObject(value: unknown): value is Ref<Element> {
  return typeof value === 'object' && value !== null && 'current' in value
}

export function ref<T extends Element>(target: Ref<T> | RefCallback<T>): unknown {
  if (typeof target === 'function') {
    return litRef(el => target((el ?? null) as T | null))
  }

  if (isRefObject(target)) {
    return litRef(el => {
      target.current = (el ?? null) as T | null
    })
  }

  // Fallback: no-op
  return litRef(() => {})
}
