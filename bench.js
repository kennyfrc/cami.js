
/**
 * Benchmark to measure the performance impact of the dbg.js library
 * on a complex calculation.
 */

// Import the dbg library
const dbg = require('./dbg.js');

// The deep equality function from the prompt
function _deepEqual(a, b) {
  // Add debug logging for version with logging
  dbg.debug("Comparing values: %o and %o", a, b);

  // Quick reference check (handles primitives and identical objects)
  if (a === b) {
    dbg.debug("=== comparison returned true");
    return true;
  }
  
  // Handle NaN equality
  if (a !== a) {
    dbg.debug("NaN check");
    return b !== b;
  }
  
  // Handle null/undefined - at this point we know they're not ===
  if (a == null || b == null) {
    dbg.debug("null/undefined check returned false");
    return false;
  }
  
  // Both must be objects at this point
  if (typeof a !== 'object' || typeof b !== 'object') {
    dbg.debug("Type check returned false (%s, %s)", typeof a, typeof b);
    return false;
  }

  // Fast path for arrays - most common use case after primitives
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      dbg.debug("Array fast path: different type or length");
      return false;
    }
    
    // Forward iteration seems faster in modern JS engines for arrays
    for (let i = 0; i < a.length; i++) {
      dbg.debug("Comparing array elements at index %d", i);
      if (!_deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  // If only one is an array, they're not equal
  if (Array.isArray(b)) {
    dbg.debug("First arg not array, second is array");
    return false;
  }
  
  // Date comparison - convert to primitive for speed
  if (a instanceof Date) {
    dbg.debug("Date comparison");
    return b instanceof Date && a.getTime() === b.getTime();
  }
  
  // RegExp comparison - compare properties directly
  if (a instanceof RegExp) {
    dbg.debug("RegExp comparison");
    return b instanceof RegExp && a.source === b.source && a.flags === b.flags;
  }
  
  // Map comparison
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) {
      dbg.debug("Map comparison failed: different type or size");
      return false;
    }
    
    dbg.debug("Map comparison with %d entries", a.size);
    for (const [key, val] of a.entries()) {
      // Maps require a lookup and then a deep comparison
      if (!b.has(key) || !_deepEqual(val, b.get(key))) return false;
    }
    return true;
  }
  
  // Set comparison
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) {
      dbg.debug("Set comparison failed: different type or size");
      return false;
    }
    
    dbg.debug("Set comparison with %d entries", a.size);
    // Due to the structure of Sets, we need to do a full comparison
    // Convert to arrays for easier comparison
    const aValues = Array.from(a);
    const bValues = Array.from(b);
    
    // A simple approach for small sets - not efficient for large sets
    // but works for most common use cases
    for (let i = 0; i < aValues.length; i++) {
      let found = false;
      for (let j = 0; j < bValues.length; j++) {
        if (_deepEqual(aValues[i], bValues[j])) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  
  // TypedArray comparison (Int8Array, Uint8Array, etc.)
  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {
    if (!ArrayBuffer.isView(b) || a.length !== b.length || a.constructor !== b.constructor) {
      dbg.debug("TypedArray comparison failed: different type or length");
      return false;
    }
    
    dbg.debug("TypedArray comparison with %d elements", a.length);
    // Fast direct comparison of TypedArray values
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  // Different constructors mean different types
  if (a.constructor !== b.constructor) {
    dbg.debug("Different constructors: %s vs %s", a.constructor.name, b.constructor.name);
    return false;
  }
  
  // Get keys and compare lengths - this quickly detects differences
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    dbg.debug("Different number of keys: %d vs %d", keys.length, Object.keys(b).length);
    return false;
  }
  
  // Use direct property access and single iteration for maximum speed
  const hasOwn = Object.prototype.hasOwnProperty;
  
  // Check key/value pairs
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    dbg.debug("Comparing object property: %s", key);
    
    // First check if property exists, then compare values
    if (!hasOwn.call(b, key) || !_deepEqual(a[key], b[key])) {
      return false;
    }
  }
  
  dbg.debug("Objects are equal");
  return true;
}

// Version of the function without any debug calls (for baseline)
function _deepEqualNoDebug(a, b) {
  if (a === b) return true;
  if (a !== a) return b !== b;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!_deepEqualNoDebug(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (Array.isArray(b)) return false;
  
  if (a instanceof Date) {
    return b instanceof Date && a.getTime() === b.getTime();
  }
  
  if (a instanceof RegExp) {
    return b instanceof RegExp && a.source === b.source && a.flags === b.flags;
  }
  
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;
    for (const [key, val] of a.entries()) {
      if (!b.has(key) || !_deepEqualNoDebug(val, b.get(key))) return false;
    }
    return true;
  }
  
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;
    const aValues = Array.from(a);
    const bValues = Array.from(b);
    for (let i = 0; i < aValues.length; i++) {
      let found = false;
      for (let j = 0; j < bValues.length; j++) {
        if (_deepEqualNoDebug(aValues[i], bValues[j])) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  
  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {
    if (!ArrayBuffer.isView(b) || a.length !== b.length || a.constructor !== b.constructor) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  if (a.constructor !== b.constructor) return false;
  
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!hasOwn.call(b, key) || !_deepEqualNoDebug(a[key], b[key])) {
      return false;
    }
  }
  
  return true;
}

// Create complex test objects for the benchmark
function createTestObjects() {
  // Create a variety of objects with different types
  const date1 = new Date('2023-01-01');
  const date2 = new Date('2023-01-01');
  
  const map1 = new Map([
    ['key1', 'value1'],
    ['key2', { nested: true, count: 42 }]
  ]);
  
  const map2 = new Map([
    ['key1', 'value1'],
    ['key2', { nested: true, count: 42 }]
  ]);
  
  const set1 = new Set([1, 2, 3, 'test']);
  const set2 = new Set([1, 2, 3, 'test']);
  
  const typedArray1 = new Uint8Array([1, 2, 3, 4, 5]);
  const typedArray2 = new Uint8Array([1, 2, 3, 4, 5]);
  
  const obj1 = {
    string: 'test string',
    number: 123.456,
    boolean: true,
    null: null,
    undefined: undefined,
    date: date1,
    regex: /test/gi,
    array: [1, 2, 3, 'four', { five: 5 }],
    nestedArray: [[1, 2], [3, 4]],
    object: { a: 1, b: 2, c: { d: 3 } },
    map: map1,
    set: set1,
    typedArray: typedArray1
  };
  
  const obj2 = {
    string: 'test string',
    number: 123.456,
    boolean: true,
    null: null,
    undefined: undefined,
    date: date2,
    regex: /test/gi,
    array: [1, 2, 3, 'four', { five: 5 }],
    nestedArray: [[1, 2], [3, 4]],
    object: { a: 1, b: 2, c: { d: 3 } },
    map: map2,
    set: set2,
    typedArray: typedArray2
  };
  
  return { obj1, obj2 };
}

// Benchmark function
function runBenchmark() {
  // Number of iterations for each test
  const iterations = 1000;
  const { obj1, obj2 } = createTestObjects();
  
  // 1. Benchmark with no debug logging (baseline)
  console.log("\n1. Baseline (No debug logging):");
  const startNoDebug = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    _deepEqualNoDebug(obj1, obj2);
  }
  
  const endNoDebug = process.hrtime.bigint();
  const timeNoDebug = Number(endNoDebug - startNoDebug) / 1_000_000; // Convert to milliseconds
  console.log(`   Total time: ${timeNoDebug.toFixed(2)} ms`);
  console.log(`   Avg per iteration: ${(timeNoDebug / iterations).toFixed(3)} ms`);
  
  // 2. Benchmark with dbg.js but debug disabled
  console.log("\n2. With dbg.js (Debug disabled):");
  dbg.setLogLevel(dbg.LOG_LEVEL_INFO); // Set to INFO to disable DEBUG
  
  const startDebugOff = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    _deepEqual(obj1, obj2);
  }
  
  const endDebugOff = process.hrtime.bigint();
  const timeDebugOff = Number(endDebugOff - startDebugOff) / 1_000_000;
  console.log(`   Total time: ${timeDebugOff.toFixed(2)} ms`);
  console.log(`   Avg per iteration: ${(timeDebugOff / iterations).toFixed(3)} ms`);
  console.log(`   Overhead vs baseline: ${((timeDebugOff / timeNoDebug - 1) * 100).toFixed(2)}%`);
  
  // 3. Benchmark with dbg.js and debug enabled
  console.log("\n3. With dbg.js (Debug enabled):");
  dbg.setLogLevel(dbg.LOG_LEVEL_DEBUG); // Enable DEBUG level
  
  // Set the output to a null logger to avoid console output affecting benchmark
  const realOutput = dbg.getLogOutput();
  dbg.setLogOutput({
    log: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {}
  });
  
  const startDebugOn = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    _deepEqual(obj1, obj2);
  }
  
  const endDebugOn = process.hrtime.bigint();
  const timeDebugOn = Number(endDebugOn - startDebugOn) / 1_000_000;
  console.log(`   Total time: ${timeDebugOn.toFixed(2)} ms`);
  console.log(`   Avg per iteration: ${(timeDebugOn / iterations).toFixed(3)} ms`);
  console.log(`   Overhead vs baseline: ${((timeDebugOn / timeNoDebug - 1) * 100).toFixed(2)}%`);
  
  // Reset logger to original
  dbg.setLogOutput(realOutput);
  
  // Summary
  console.log("\nSummary:");
  console.log("-------------------------------------------------------");
  console.log(`Baseline (no debug):       ${(timeNoDebug / iterations).toFixed(3)} ms per iteration`);
  console.log(`Debug disabled:            ${(timeDebugOff / iterations).toFixed(3)} ms per iteration (${((timeDebugOff / timeNoDebug - 1) * 100).toFixed(2)}% overhead)`);
  console.log(`Debug enabled but silent:  ${(timeDebugOn / iterations).toFixed(3)} ms per iteration (${((timeDebugOn / timeNoDebug - 1) * 100).toFixed(2)}% overhead)`);
  console.log("-------------------------------------------------------");
}

// Run the benchmark
runBenchmark();
