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
    source: () => T;
    callback: (value: T, oldValue: T | undefined) => void;
    _value: T | undefined;
    _oldValue: T | undefined;
    _isDirty: boolean;
    _dispose: () => void;
}
/**
 * Enqueue a dirty reaction for the next settle drain.
 */
export declare function enqueueSettle(reaction: SettleReaction): void;
/**
 * Remove a reaction from the queue (used on disconnect).
 */
export declare function dequeueSettle(reaction: SettleReaction): void;
//# sourceMappingURL=scheduler.d.ts.map