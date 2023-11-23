import { _config } from './config.js';

function _trace(functionName, ...messages) {
  if (_config.debug.isEnabled) {
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

export { _trace };
