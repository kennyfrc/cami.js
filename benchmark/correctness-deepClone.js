/**
 * Correctness Benchmark for _deepClone
 *
 * This benchmark tests the correctness of our _deepClone implementation
 * against popular libraries to ensure we maintain compatibility while
 * optimizing for performance.
 */
import fastCopy from 'fast-copy'
import lodashCloneDeep from 'lodash.clonedeep'
import rfdc from 'rfdc'

import { _deepClone, _deepEqual } from '../build/utils.js'

// Initialize RFDC
const rfdcClone = rfdc({ circles: true, proto: true })

// Test cases covering edge cases and common scenarios
const testCases = [
  // Basic primitives (should return same reference)
  { name: 'Number primitive', input: 42, shouldBeCloned: false },
  { name: 'String primitive', input: 'hello', shouldBeCloned: false },
  { name: 'Boolean primitive', input: true, shouldBeCloned: false },
  { name: 'Null', input: null, shouldBeCloned: false },
  { name: 'Undefined', input: undefined, shouldBeCloned: false },
  { name: 'NaN', input: NaN, shouldBeCloned: false },
  { name: 'Symbol', input: Symbol('test'), shouldBeCloned: false },

  // Objects (should be cloned)
  { name: 'Empty object', input: {}, shouldBeCloned: true },
  {
    name: 'Simple object',
    input: { a: 1, b: 2, c: 'hello' },
    shouldBeCloned: true,
  },
  {
    name: 'Nested object',
    input: { a: { b: { c: 1 } } },
    shouldBeCloned: true,
  },

  // Arrays (should be cloned)
  { name: 'Empty array', input: [], shouldBeCloned: true },
  { name: 'Simple array', input: [1, 2, 3], shouldBeCloned: true },
  {
    name: 'Nested array',
    input: [
      [1, 2],
      [3, 4],
    ],
    shouldBeCloned: true,
  },
  {
    name: 'Mixed array',
    input: [1, 'hello', { a: 1 }, [2, 3]],
    shouldBeCloned: true,
  },

  // Dates (should be cloned)
  {
    name: 'Date object',
    input: new Date('2023-01-01'),
    shouldBeCloned: true,
  },
  { name: 'Current date', input: new Date(), shouldBeCloned: true },

  // RegExp (should be cloned)
  { name: 'Simple regex', input: /test/, shouldBeCloned: true },
  { name: 'Regex with flags', input: /test/gi, shouldBeCloned: true },

  // Maps (should be cloned)
  { name: 'Empty map', input: new Map(), shouldBeCloned: true },
  {
    name: 'Simple map',
    input: new Map([
      ['a', 1],
      ['b', 2],
    ]),
    shouldBeCloned: true,
  },
  {
    name: 'Nested map',
    input: new Map([
      ['obj', { a: 1 }],
      ['arr', [1, 2, 3]],
    ]),
    shouldBeCloned: true,
  },

  // Sets (should be cloned)
  { name: 'Empty set', input: new Set(), shouldBeCloned: true },
  { name: 'Simple set', input: new Set([1, 2, 3]), shouldBeCloned: true },
  {
    name: 'Set with objects',
    input: new Set([{ a: 1 }, { b: 2 }]),
    shouldBeCloned: true,
  },

  // TypedArrays (should be cloned)
  {
    name: 'Int8Array',
    input: new Int8Array([1, 2, 3]),
    shouldBeCloned: true,
  },
  {
    name: 'Uint8Array',
    input: new Uint8Array([1, 2, 3]),
    shouldBeCloned: true,
  },
  {
    name: 'Float32Array',
    input: new Float32Array([1.1, 2.2, 3.3]),
    shouldBeCloned: true,
  },
  {
    name: 'Float64Array',
    input: new Float64Array([1.1, 2.2, 3.3]),
    shouldBeCloned: true,
  },

  // Functions (should return same reference)
  { name: 'Function', input: Math.max, shouldBeCloned: false },
  { name: 'Arrow function', input: () => 42, shouldBeCloned: false },

  // Complex nested structures
  {
    name: 'Complex object',
    input: {
      users: [
        {
          id: 1,
          name: 'John',
          meta: { created: new Date('2023-01-01') },
        },
        {
          id: 2,
          name: 'Jane',
          meta: { created: new Date('2023-01-02') },
        },
      ],
      settings: new Map([
        ['theme', 'dark'],
        ['lang', 'en'],
      ]),
      tags: new Set(['important', 'urgent']),
      pattern: /user-\d+/gi,
    },
    shouldBeCloned: true,
  },
]

// Create circular reference test cases
const createCircularTest = () => {
  const obj = { a: 1, b: 2 }
  obj.self = obj
  obj.nested = { parent: obj }
  return { name: 'Circular reference', input: obj, shouldBeCloned: true }
}

// Add circular reference test
testCases.push(createCircularTest())

// Library implementations to test
const libraries = [
  { name: '_deepClone', fn: _deepClone },
  { name: 'rfdc', fn: rfdcClone },
  { name: 'fast-copy', fn: fastCopy },
  { name: 'lodash.cloneDeep', fn: lodashCloneDeep },
]

// Test functions
function testCloneCorrectness(cloneFn, original, testName) {
  const errors = []

  try {
    const cloned = cloneFn(original)

    // Test 1: Deep equality
    if (!_deepEqual(original, cloned)) {
      errors.push('Cloned object is not deeply equal to original')
    }

    // Test 2: Reference independence (for objects)
    if (original !== null && typeof original === 'object') {
      if (original === cloned) {
        errors.push('Cloned object has same reference as original')
      }

      // Test nested reference independence
      if (Array.isArray(original) && original.length > 0) {
        if (typeof original[0] === 'object' && original[0] !== null) {
          if (original[0] === cloned[0]) {
            errors.push('Nested objects share references')
          }
        }
      } else if (original.constructor === Object) {
        const keys = Object.keys(original)
        for (const key of keys) {
          if (typeof original[key] === 'object' && original[key] !== null) {
            if (original[key] === cloned[key]) {
              errors.push(`Nested object at key "${key}" shares reference`)
              break
            }
          }
        }
      }
    }

    // Test 3: Type preservation
    if (original !== null && typeof original === 'object') {
      if (original.constructor !== cloned.constructor) {
        errors.push(
          `Constructor mismatch: ${original.constructor.name} !== ${cloned.constructor.name}`
        )
      }

      // Special type checks
      if (original instanceof Date) {
        if (!(cloned instanceof Date) || original.getTime() !== cloned.getTime()) {
          errors.push('Date cloning failed')
        }
      }

      if (original instanceof RegExp) {
        if (
          !(cloned instanceof RegExp) ||
          original.source !== cloned.source ||
          original.flags !== cloned.flags
        ) {
          errors.push('RegExp cloning failed')
        }
      }

      if (original instanceof Map) {
        if (!(cloned instanceof Map) || original.size !== cloned.size) {
          errors.push('Map cloning failed')
        }
      }

      if (original instanceof Set) {
        if (!(cloned instanceof Set) || original.size !== cloned.size) {
          errors.push('Set cloning failed')
        }
      }

      if (ArrayBuffer.isView(original) && !(original instanceof DataView)) {
        if (!ArrayBuffer.isView(cloned) || original.constructor !== cloned.constructor) {
          errors.push('TypedArray cloning failed')
        }
      }
    }

    // Test 4: Mutation independence
    if (original !== null && typeof original === 'object') {
      try {
        // Try to mutate the clone
        if (Array.isArray(cloned)) {
          cloned.push('mutation-test')
          if (Array.isArray(original) && original.includes('mutation-test')) {
            errors.push('Array mutation affected original')
          }
        } else if (cloned.constructor === Object) {
          cloned.__test_mutation = 'test'
          if (original.__test_mutation === 'test') {
            errors.push('Object mutation affected original')
          }
        }
      } catch (e) {
        // Some objects might be immutable, that's okay
      }
    }

    return { success: errors.length === 0, errors, result: cloned }
  } catch (error) {
    return {
      success: false,
      errors: [`Exception: ${error.message}`],
      result: null,
    }
  }
}

// Run tests
function runCorrectnessTests() {
  console.log('Running correctness tests for _deepClone...\n')

  const results = {}

  // Initialize results
  libraries.forEach(lib => {
    results[lib.name] = {
      passed: 0,
      failed: 0,
      errors: 0,
      failures: [],
    }
  })

  // Run each test case
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)

    libraries.forEach(lib => {
      const test = testCloneCorrectness(lib.fn, testCase.input, testCase.name)

      if (test.success) {
        results[lib.name].passed++
        console.log(`  ✓ ${lib.name}: PASSED`)
      } else {
        results[lib.name].failed++
        results[lib.name].failures.push({
          test: testCase.name,
          errors: test.errors,
          input: testCase.input,
        })
        console.log(`  ✗ ${lib.name}: FAILED - ${test.errors.join(', ')}`)
      }
    })

    console.log('')
  })

  // Print summary
  console.log('='.repeat(60))
  console.log('CORRECTNESS TEST SUMMARY')
  console.log('='.repeat(60))

  libraries.forEach(lib => {
    const { passed, failed, errors } = results[lib.name]
    const total = passed + failed + errors
    const percentage = ((passed / total) * 100).toFixed(1)

    console.log(`${lib.name}:`)
    console.log(`  Passed: ${passed}/${total} (${percentage}%)`)
    console.log(`  Failed: ${failed}`)
    console.log(`  Errors: ${errors}`)

    if (results[lib.name].failures.length > 0) {
      console.log(`  Failures:`)
      results[lib.name].failures.slice(0, 5).forEach(failure => {
        console.log(`    - ${failure.test}: ${failure.errors.join(', ')}`)
      })
      if (results[lib.name].failures.length > 5) {
        console.log(`    ... and ${results[lib.name].failures.length - 5} more`)
      }
    }

    console.log('')
  })

  return results
}

// Export for use in other files
export { runCorrectnessTests, testCases }

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCorrectnessTests()
}
