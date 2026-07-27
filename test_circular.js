import { _deepEqual } from "./build/utils.js";

// Test circular reference
const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log("Testing circular reference...");
try {
    const result = _deepEqual(obj1, obj2);
    console.log("Result:", result);
} catch (error) {
    console.log("Error:", error.message);
}

// Test simple case
console.log("\nTesting simple case...");
const simple1 = { a: 1, b: 2 };
const simple2 = { a: 1, b: 2 };
console.log("Simple result:", _deepEqual(simple1, simple2));
