/**
 * Cami.js phased scheduler — coordinates afterSettle reactions.
 *
 * The scheduler sits above the existing per-component effect system.
 * It does NOT replace effect(() => render()). It adds a post-settle
 * phase that runs after afterRender effects have flushed.
 *
 * Lifecycle per macrotask:
 *   1. Store dispatch → ObservableState notifies subscribers synchronously
 *   2. Each component's effect(() => render()) re-renders, registering
 *      afterRender effects (which schedule their own microtask)
 *   3. afterSettle sources tracked via effect() mark reactions dirty
 *   4. Settle drain macrotask fires (after all microtasks, including
 *      afterRender, have flushed):
 *      a. Process ONE reaction per drain cycle
 *      b. If the callback triggers state changes → new renders →
 *         new afterRender (microtask) → new dirty reactions
 *      c. Schedule another drain macrotask (allows afterRender to flush first)
 *      d. Reset pass counter when queue is empty
 *   5. maxPasses guard (default 10) prevents infinite feedback loops
 */

export interface SettleReaction<T = unknown> {
  source: () => T
  callback: (value: T, oldValue: T | undefined) => void
  _value: T | undefined
  _oldValue: T | undefined
  _isDirty: boolean
  _dispose: () => void
}

// Module-level scheduler state
const __settleQueue: Set<SettleReaction> = new Set()
let __settleScheduled = false
let __settlePasses = 0
const __maxSettlePasses = 10

/**
 * Enqueue a dirty reaction for the next settle drain.
 */
export function enqueueSettle(reaction: SettleReaction): void {
  __settleQueue.add(reaction)
  scheduleSettleDrain()
}

/**
 * Remove a reaction from the queue (used on disconnect).
 */
export function dequeueSettle(reaction: SettleReaction): void {
  __settleQueue.delete(reaction)
}

function scheduleSettleDrain(): void {
  if (__settleScheduled || __settleQueue.size === 0) return
  __settleScheduled = true

  // Use setTimeout(0) (macrotask) instead of queueMicrotask to guarantee
  // the settle drain runs AFTER all pending microtasks — including
  // afterRender effects, which are scheduled as microtasks.
  //
  // The issue (P1 from review): ObservableState notifies observers in
  // reverse order, so afterSettle's effect() runs before the render
  // effect. If we used queueMicrotask, the settle drain would be
  // queued before the afterRender microtask and fire first, violating
  // the documented ordering (afterSettle must run after afterRender).
  setTimeout(() => {
    __settleScheduled = false
    try {
      drainSettleQueue()
    } catch (e) {
      console.error(e)
    }
  }, 0)
}

function drainSettleQueue(): void {
  if (__settleQueue.size === 0) return

  // Process only ONE reaction per drain cycle. (P1 fix from review)
  // If the callback triggers state changes, those changes will schedule
  // afterRender effects (microtasks). By processing one at a time and
  // then re-scheduling the drain as a macrotask, we guarantee that any
  // afterRender work from the callback has flushed before the next
  // afterSettle reaction runs.
  const iterator = __settleQueue.values()
  const reaction = iterator.next().value
  if (!reaction) return

  __settleQueue.delete(reaction)

  const queueSizeBefore = __settleQueue.size

  if (reaction._isDirty) {
    reaction._isDirty = false
    try {
      reaction.callback(reaction._value!, reaction._oldValue)
    } catch (e) {
      console.error('[Cami.js] afterSettle reaction error:', e)
    }
  }

  // Count feedback cycles, not individual reactions. (P1 fix from re-review)
  // Only increment the pass counter if the callback enqueued NEW work
  // (queue grew during callback execution). Independent reactions that were
  // already in the queue don't count as feedback.
  if (__settleQueue.size > queueSizeBefore) {
    __settlePasses++
    if (__settlePasses > __maxSettlePasses) {
      const count = __settleQueue.size
      __settleQueue.clear()
      __settlePasses = 0
      throw new Error(
        `[Cami.js] afterSettle loop exceeded maxPasses (${__maxSettlePasses}). ` +
          `A reaction is continuously triggering state changes. ` +
          `${count} reaction(s) were still pending.`
      )
    }
  } else if (__settleQueue.size === 0) {
    // Queue drained completely — reset pass counter
    __settlePasses = 0
  }

  // If more work remains, schedule another drain macrotask.
  // This allows afterRender effects (if any were scheduled by the callback)
  // to flush as microtasks before the next afterSettle reaction runs.
  if (__settleQueue.size > 0) {
    scheduleSettleDrain()
  }
}
