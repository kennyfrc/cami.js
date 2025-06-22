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

let isProduction = (function (): boolean {
  const hostname =
    (typeof window !== "undefined" &&
      window.location &&
      window.location.hostname) ||
    "";
  return hostname.indexOf("localhost") === -1 && hostname !== "0.0.0.0";
})();

let alwaysEnabled = false;

function captureStackTrace(error: Error): void {
  if ((Error as any).captureStackTrace) {
    (Error as any).captureStackTrace(error, invariant);
  } else {
    error.stack = new Error().stack;
  }
}

class InvariantViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvariantViolationError";
    captureStackTrace(this);
  }
}

interface InvariantConfig {
  development?: () => boolean;
  production?: () => boolean;
  alwaysEnabled?: boolean;
}

interface InvariantFunction {
  (message: string, callback: () => boolean): void;
  config(config: InvariantConfig): void;
}

function invariant(message: string, callback: () => boolean): void {
  if (!alwaysEnabled && isProduction) return; // No-op in production unless alwaysEnabled is true

  if (!callback()) {
    const error = new InvariantViolationError("Invariant Violation: " + message);

    // In non-production environments, capture the stack trace
    if (!isProduction) {
      captureStackTrace(error);
    }

    throw error;
  }
}

(invariant as InvariantFunction).config = function (config: InvariantConfig): void {
  const development = config.development;
  const production = config.production;

  if (typeof development === "function" && typeof production === "function") {
    const isDev = development();
    const isProd = production();
    isProduction = isProd && !isDev; // Cache the result
    alwaysEnabled = false; // Disable alwaysEnabled if both development and production are defined
  } else if ("alwaysEnabled" in config) {
    alwaysEnabled = config.alwaysEnabled!;
  }
};

export default invariant as InvariantFunction;
export type { InvariantConfig, InvariantFunction };