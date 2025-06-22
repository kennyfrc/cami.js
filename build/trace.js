import { __config } from "./config.js";
/**
 * @private
 * @function
 * Logs the trace of a function execution if debug mode is enabled.
 *
 * @param functionName - The name of the function to trace.
 * @param messages - Additional messages to log in the console.
 *
 * @example
 * __trace('myFunction', 'This is a test message');
 */
function __trace(functionName, ...messages) {
    if (__config.debug.isEnabled) {
        const formattedMessages = messages.join("\n");
        if (functionName === "cami:elem:state:change") {
            console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", `Changed property state: ${messages[0]}`);
            console.log(`oldValue:`, messages[1]);
            console.log(`newValue:`, messages[2]);
        }
        else if (functionName === "cami:store:state:change") {
            console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", `Changed store state: ${messages[0]}`);
            const oldPatches = messages[1];
            const newPatches = messages[2];
            console.log(`oldValue of ${oldPatches[0].path.join(".")}:`, oldPatches[0].value);
            console.log(`newValue of ${newPatches[0].path.join(".")}:`, newPatches[0].value);
        }
        else {
            console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", formattedMessages);
        }
        console.trace();
        console.groupEnd();
    }
}
export { __trace };
//# sourceMappingURL=trace.js.map