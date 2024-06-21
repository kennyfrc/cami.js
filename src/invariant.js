/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide a message and a callback function that returns a boolean.
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 *
 * @param {string} message - The error message.
 * @param {function} callback - The function that returns a boolean.
 * @throws Will throw an error if the callback returns false.
 */

let isProduction = (function() {
  var hostname = (typeof window !== 'undefined' && window.location && window.location.hostname) || '';
  return hostname.indexOf('localhost') === -1 && hostname !== '0.0.0.0';
})();

let alwaysEnabled = false;

function captureStackTrace(error) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, invariant);
  } else {
    error.stack = (new Error()).stack;
  }
}

class InvariantViolationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvariantViolationError';
    captureStackTrace(this);
  }
}

function invariant(message, callback) {
  if (!alwaysEnabled && isProduction) return; // No-op in production unless alwaysEnabled is true

  if (!callback()) {
    var error = new InvariantViolationError('Invariant Violation: ' + message);

    // In non-production environments, capture the stack trace
    if (!isProduction) {
      captureStackTrace(error);
    }

    throw error;
  }
}

invariant.config = function(config) {
  var development = config.development;
  var production = config.production;

  if (typeof development === 'function' && typeof production === 'function') {
    var isDev = development();
    var isProd = production();
    isProduction = isProd && !isDev; // Cache the result
    alwaysEnabled = false; // Disable alwaysEnabled if both development and production are defined
  } else if (config.hasOwnProperty('alwaysEnabled')) {
    alwaysEnabled = config.alwaysEnabled;
  }
};

export default invariant;
