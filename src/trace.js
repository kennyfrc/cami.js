import { __config } from './config.js';

/**
 * @private
 * @function
 * Logs the trace of a function execution if debug mode is enabled.
 *
 * @param {string} functionName - The name of the function to trace.
 * @param {...any} messages - Additional messages to log in the console.
 *
 * @example
 * __trace('myFunction', 'This is a test message');
 */
function __trace(functionName, ...messages) {
  if (__config.debug.isEnabled) {
    if (functionName === 'cami:state:change') {
      console.groupCollapsed(`%c[${functionName}]`, 'color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;', `${messages[0]} changed`);
      console.log(`oldValue:`, messages[1]);
      console.log(`newValue:`, messages[2]);
    } else {
      console.groupCollapsed(`%c[${functionName}]`, 'color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;', ...messages);
    }

    console.trace();
    console.groupEnd();
  }
}

export { __trace };
