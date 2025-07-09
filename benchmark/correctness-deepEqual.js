/**
 * Correctness Benchmark for _deepEqual
 * 
 * This benchmark tests the correctness of our _deepEqual implementation
 * against popular libraries to ensure we maintain compatibility while
 * optimizing for performance.
 */

import { _deepEqual } from '../build/utils.js';
import fastDeepEqual from 'fast-deep-equal';
import { deepEqual as fastEquals } from 'fast-equals';
import lodashIsEqual from 'lodash.isequal';

// Test cases covering edge cases and common scenarios
const testCases = [
  // Basic primitives
  { name: 'Identical primitives', a: 42, b: 42, expected: true },
  { name: 'Different primitives', a: 42, b: 43, expected: false },
  { name: 'String vs Number', a: '42', b: 42, expected: false },
  { name: 'Boolean vs Number', a: true, b: 1, expected: false },
  
  // Null and undefined
  { name: 'Both null', a: null, b: null, expected: true },
  { name: 'Both undefined', a: undefined, b: undefined, expected: true },
  { name: 'Null vs undefined', a: null, b: undefined, expected: false },
  { name: 'Null vs 0', a: null, b: 0, expected: false },
  { name: 'Undefined vs 0', a: undefined, b: 0, expected: false },
  
  // NaN handling
  { name: 'Both NaN', a: NaN, b: NaN, expected: true },
  { name: 'NaN vs number', a: NaN, b: 42, expected: false },
  { name: 'NaN vs string', a: NaN, b: 'NaN', expected: false },
  
  // Zero handling
  { name: 'Positive zero vs negative zero', a: 0, b: -0, expected: true },
  { name: 'Positive zero vs positive zero', a: 0, b: 0, expected: true },
  { name: 'Negative zero vs negative zero', a: -0, b: -0, expected: true },
  
  // Simple objects
  { name: 'Empty objects', a: {}, b: {}, expected: true },
  { name: 'Simple equal objects', a: { a: 1, b: 2 }, b: { a: 1, b: 2 }, expected: true },
  { name: 'Simple unequal objects', a: { a: 1, b: 2 }, b: { a: 1, b: 3 }, expected: false },
  { name: 'Different key order', a: { a: 1, b: 2 }, b: { b: 2, a: 1 }, expected: true },
  { name: 'Missing key', a: { a: 1, b: 2 }, b: { a: 1 }, expected: false },
  { name: 'Extra key', a: { a: 1 }, b: { a: 1, b: 2 }, expected: false },
  
  // Arrays
  { name: 'Empty arrays', a: [], b: [], expected: true },
  { name: 'Simple equal arrays', a: [1, 2, 3], b: [1, 2, 3], expected: true },
  { name: 'Simple unequal arrays', a: [1, 2, 3], b: [1, 2, 4], expected: false },
  { name: 'Different length arrays', a: [1, 2, 3], b: [1, 2], expected: false },
  { name: 'Array vs object', a: [1, 2, 3], b: { 0: 1, 1: 2, 2: 3 }, expected: false },
  
  // Nested structures
  { name: 'Nested objects', a: { a: { b: { c: 1 } } }, b: { a: { b: { c: 1 } } }, expected: true },
  { name: 'Nested arrays', a: [[1, 2], [3, 4]], b: [[1, 2], [3, 4]], expected: true },
  { name: 'Mixed nested', a: { a: [1, { b: 2 }] }, b: { a: [1, { b: 2 }] }, expected: true },
  
  // Dates
  { name: 'Same dates', a: new Date('2023-01-01'), b: new Date('2023-01-01'), expected: true },
  { name: 'Different dates', a: new Date('2023-01-01'), b: new Date('2023-01-02'), expected: false },
  { name: 'Date vs string', a: new Date('2023-01-01'), b: '2023-01-01', expected: false },
  { name: 'Date vs timestamp', a: new Date('2023-01-01'), b: new Date('2023-01-01').getTime(), expected: false },
  
  // RegExp
  { name: 'Same regex', a: /test/gi, b: /test/gi, expected: true },
  { name: 'Different pattern', a: /test/gi, b: /fest/gi, expected: false },
  { name: 'Different flags', a: /test/gi, b: /test/g, expected: false },
  { name: 'Regex vs string', a: /test/, b: 'test', expected: false },
  
  // Maps
  { name: 'Empty maps', a: new Map(), b: new Map(), expected: true },
  { name: 'Simple equal maps', a: new Map([['a', 1], ['b', 2]]), b: new Map([['a', 1], ['b', 2]]), expected: true },
  { name: 'Different map values', a: new Map([['a', 1]]), b: new Map([['a', 2]]), expected: false },
  { name: 'Different map keys', a: new Map([['a', 1]]), b: new Map([['b', 1]]), expected: false },
  { name: 'Map vs object', a: new Map([['a', 1]]), b: { a: 1 }, expected: false },
  
  // Sets
  { name: 'Empty sets', a: new Set(), b: new Set(), expected: true },
  { name: 'Simple equal sets', a: new Set([1, 2, 3]), b: new Set([1, 2, 3]), expected: true },
  { name: 'Different order sets', a: new Set([1, 2, 3]), b: new Set([3, 2, 1]), expected: true },
  { name: 'Different set values', a: new Set([1, 2, 3]), b: new Set([1, 2, 4]), expected: false },
  { name: 'Set vs array', a: new Set([1, 2, 3]), b: [1, 2, 3], expected: false },
  
  // TypedArrays
  { name: 'Int8Array equal', a: new Int8Array([1, 2, 3]), b: new Int8Array([1, 2, 3]), expected: true },
  { name: 'Int8Array different', a: new Int8Array([1, 2, 3]), b: new Int8Array([1, 2, 4]), expected: false },
  { name: 'Different typed arrays', a: new Int8Array([1, 2, 3]), b: new Uint8Array([1, 2, 3]), expected: false },
  { name: 'TypedArray vs array', a: new Int8Array([1, 2, 3]), b: [1, 2, 3], expected: false },
  
  // Functions
  { name: 'Same function reference', a: Math.max, b: Math.max, expected: true },
  { name: 'Different functions', a: Math.max, b: Math.min, expected: false },
  { name: 'Function vs string', a: Math.max, b: 'Math.max', expected: false },
  
  // Complex scenarios
  { name: 'Complex nested structure', 
    a: { 
      users: [
        { id: 1, name: 'John', meta: { created: new Date('2023-01-01') } },
        { id: 2, name: 'Jane', meta: { created: new Date('2023-01-02') } }
      ],
      settings: new Map([['theme', 'dark'], ['lang', 'en']]),
      tags: new Set(['important', 'urgent'])
    },
    b: { 
      users: [
        { id: 1, name: 'John', meta: { created: new Date('2023-01-01') } },
        { id: 2, name: 'Jane', meta: { created: new Date('2023-01-02') } }
      ],
      settings: new Map([['theme', 'dark'], ['lang', 'en']]),
      tags: new Set(['important', 'urgent'])
    },
    expected: true
  },
];

// Create circular reference test cases
const createCircularTest = () => {
  const obj1 = { a: 1 };
  obj1.self = obj1;
  
  const obj2 = { a: 1 };
  obj2.self = obj2;
  
  return { name: 'Circular reference', a: obj1, b: obj2, expected: true };
};

const createDifferentCircularTest = () => {
  const obj1 = { a: 1 };
  obj1.self = obj1;
  
  const obj2 = { a: 2 };
  obj2.self = obj2;
  
  return { name: 'Different circular reference', a: obj1, b: obj2, expected: false };
};

// Add circular reference tests
testCases.push(createCircularTest());
testCases.push(createDifferentCircularTest());

// Library implementations to test
const libraries = [
  { name: '_deepEqual', fn: _deepEqual },
  { name: 'fast-deep-equal', fn: fastDeepEqual },
  { name: 'fast-equals', fn: fastEquals },
  { name: 'lodash.isEqual', fn: lodashIsEqual }
];

// Run tests
function runCorrectnessTests() {
  console.log('Running correctness tests for _deepEqual...\n');
  
  const results = {};
  
  // Initialize results
  libraries.forEach(lib => {
    results[lib.name] = {
      passed: 0,
      failed: 0,
      errors: 0,
      failures: []
    };
  });
  
  // Run each test case
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    
    libraries.forEach(lib => {
      try {
        const result = lib.fn(testCase.a, testCase.b);
        
        if (result === testCase.expected) {
          results[lib.name].passed++;
          console.log(`  ✓ ${lib.name}: ${result}`);
        } else {
          results[lib.name].failed++;
          results[lib.name].failures.push({
            test: testCase.name,
            expected: testCase.expected,
            actual: result,
            a: testCase.a,
            b: testCase.b
          });
          console.log(`  ✗ ${lib.name}: ${result} (expected ${testCase.expected})`);
        }
      } catch (error) {
        results[lib.name].errors++;
        results[lib.name].failures.push({
          test: testCase.name,
          error: error.message,
          a: testCase.a,
          b: testCase.b
        });
        console.log(`  ✗ ${lib.name}: ERROR - ${error.message}`);
      }
    });
    
    console.log('');
  });
  
  // Print summary
  console.log('='.repeat(60));
  console.log('CORRECTNESS TEST SUMMARY');
  console.log('='.repeat(60));
  
  libraries.forEach(lib => {
    const { passed, failed, errors } = results[lib.name];
    const total = passed + failed + errors;
    const percentage = ((passed / total) * 100).toFixed(1);
    
    console.log(`${lib.name}:`);
    console.log(`  Passed: ${passed}/${total} (${percentage}%)`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Errors: ${errors}`);
    
    if (results[lib.name].failures.length > 0) {
      console.log(`  Failures:`);
      results[lib.name].failures.forEach(failure => {
        if (failure.error) {
          console.log(`    - ${failure.test}: ERROR - ${failure.error}`);
        } else {
          console.log(`    - ${failure.test}: got ${failure.actual}, expected ${failure.expected}`);
        }
      });
    }
    
    console.log('');
  });
  
  return results;
}

// Export for use in other files
export { runCorrectnessTests, testCases };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCorrectnessTests();
}