/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide a message and a callback function that returns a boolean.
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 *
 * @param message - The error message.
 * @param callback - The function that returns a boolean.
 * @throws Will throw an error if the callback returns false.
 */
interface InvariantConfig {
  development?: () => boolean;
  production?: () => boolean;
  alwaysEnabled?: boolean;
}
interface InvariantFunction {
  (message: string, callback: () => boolean): void;
  config(config: InvariantConfig): void;
}
declare const _default: InvariantFunction;
export default _default;
export type { InvariantConfig, InvariantFunction };
//# sourceMappingURL=invariant.d.ts.map
