import { repeat } from 'lit-html/directives/repeat.js'

import { __config } from '../config'

type KeyedRepeatOptions = {
  devAssertStable?: boolean
}

function warn(message: string): void {
  console.warn(`[Cami.js] ${message}`)
}

export function keyedRepeat<T>(
  items: readonly T[],
  key: (item: T, index: number) => string,
  render: (item: T, index: number) => unknown,
  opts?: KeyedRepeatOptions
): unknown {
  const keys = items.map((item, index) => key(item, index))
  const shouldWarn = opts?.devAssertStable ?? __config.debug.isEnabled

  if (shouldWarn) {
    const seen = new Set<string>()
    for (let i = 0; i < keys.length; i++) {
      const value = keys[i]
      if (typeof value !== 'string' || value.length === 0) {
        warn(`keyedRepeat expected string keys. Received ${String(value)} at index ${i}.`)
      } else if (seen.has(value)) {
        warn(`keyedRepeat received duplicate key "${value}" at index ${i}.`)
      }
      if (typeof value === 'string') {
        seen.add(value)
      }
    }
  }

  return repeat(items, (_item, index) => keys[index]!, render)
}

export type { KeyedRepeatOptions }
