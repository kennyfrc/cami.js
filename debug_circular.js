import { _deepEqual } from "./build/utils.js";

// Test circular reference step by step
const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log("obj1:", obj1);
console.log("obj2:", obj2);
console.log("obj1 === obj2:", obj1 === obj2);
console.log("obj1.self === obj1:", obj1.self === obj1);
console.log("obj2.self === obj2:", obj2.self === obj2);

// Test with no circular reference first
const obj3 = { a: 1 };
const obj4 = { a: 1 };
console.log("\nTesting non-circular:");
console.log("Non-circular result:", _deepEqual(obj3, obj4));

// Test circular reference with debug
console.log("\nTesting circular reference...");
try {
    const visited = new WeakMap();
    visited.set(obj1, obj2);
    console.log("Visited contains obj1:", visited.has(obj1));
    console.log("Visited value for obj1:", visited.get(obj1));
    console.log("visited.get(obj1) === obj2:", visited.get(obj1) === obj2);

    // Try the actual function
    const result = _deepEqual(obj1, obj2);
    console.log("Result:", result);
} catch (error) {
    console.log("Error:", error.message);
    console.log("Stack:", error.stack.split("\n").slice(0, 10).join("\n"));
}
