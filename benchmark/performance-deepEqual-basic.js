/**
 * Performance Benchmark for _deepEqual - Basic Tests
 *
 * This benchmark tests the performance of our _deepEqual implementation
 * against popular libraries on basic data structures.
 */
import Benchmark from 'benchmark'
import fastDeepEqual from 'fast-deep-equal'
import { deepEqual as fastEquals } from 'fast-equals'
import lodashIsEqual from 'lodash.isequal'

import { _deepEqual } from '../build/utils.js'

// Create test fixtures
const createSimpleFixture = () => ({
  string: 'hello world',
  number: 42,
  boolean: true,
  null: null,
  nested: {
    array: [1, 2, 3],
    object: { a: 1, b: 2 },
  },
})

const createComplexFixture = () => {
  const obj = {
    string: 'hello world',
    number: 42,
    boolean: true,
    date: new Date('2023-01-01'),
    regexp: /test/gi,
    array: [1, 2, { a: 1, b: 2 }],
    map: new Map([
      ['key1', 'value1'],
      ['key2', { nested: true }],
    ]),
    set: new Set([1, 2, { a: 'test' }]),
    nested: {
      level1: {
        level2: {
          level3: {
            value: 'deep nesting',
          },
        },
      },
    },
  }

  // Add circular reference
  obj.circular = obj
  // Add reference to nested object
  obj.reference = obj.nested

  return obj
}

const createArrayFixture = () => {
  const array = []
  for (let i = 0; i < 1000; i++) {
    array.push({
      id: i,
      name: `Item ${i}`,
      value: i % 2 === 0 ? { even: true } : { odd: true },
      tags: [`tag-${i}`, `tag-${i + 1}`],
    })
  }
  return array
}

// Create equal fixtures for equality testing
const fixtures = {
  simple: createSimpleFixture(),
  complex: createComplexFixture(),
  array: createArrayFixture(),
}

const fixtures2 = {
  simple: createSimpleFixture(),
  complex: createComplexFixture(),
  array: createArrayFixture(),
}

// Slightly modify a copy for inequality testing
const fixturesModified = {
  simple: { ...createSimpleFixture(), extra: 'field' },
  complex: { ...createComplexFixture(), extra: 'field' },
  array: [...createArrayFixture(), { id: 1001 }],
}

// Run benchmarks
console.log('Running deepEqual basic performance benchmarks...\n')

new Benchmark.Suite('deepEqual - Equal Objects')
  .add('_deepEqual - simple (equal)', function () {
    _deepEqual(fixtures.simple, fixtures2.simple)
  })
  .add('fast-deep-equal - simple (equal)', function () {
    fastDeepEqual(fixtures.simple, fixtures2.simple)
  })
  .add('fast-equals - simple (equal)', function () {
    fastEquals(fixtures.simple, fixtures2.simple)
  })
  .add('lodash.isEqual - simple (equal)', function () {
    lodashIsEqual(fixtures.simple, fixtures2.simple)
  })
  .add('_deepEqual - complex (equal)', function () {
    _deepEqual(fixtures.complex, fixtures2.complex)
  })
  .add('fast-deep-equal - complex (equal)', function () {
    fastDeepEqual(fixtures.complex, fixtures2.complex)
  })
  .add('fast-equals - complex (equal)', function () {
    fastEquals(fixtures.complex, fixtures2.complex)
  })
  .add('lodash.isEqual - complex (equal)', function () {
    lodashIsEqual(fixtures.complex, fixtures2.complex)
  })
  .add('_deepEqual - array (equal)', function () {
    _deepEqual(fixtures.array, fixtures2.array)
  })
  .add('fast-deep-equal - array (equal)', function () {
    fastDeepEqual(fixtures.array, fixtures2.array)
  })
  .add('fast-equals - array (equal)', function () {
    fastEquals(fixtures.array, fixtures2.array)
  })
  .add('lodash.isEqual - array (equal)', function () {
    lodashIsEqual(fixtures.array, fixtures2.array)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(
      '\nFastest equal objects deepEqual implementation is ' + this.filter('fastest').map('name')
    )
    console.log(
      'Slowest equal objects deepEqual implementation is ' + this.filter('slowest').map('name')
    )
  })
  .run({ async: false })

console.log('\n' + '='.repeat(60) + '\n')

new Benchmark.Suite('deepEqual - Unequal Objects')
  .add('_deepEqual - simple (not equal)', function () {
    _deepEqual(fixtures.simple, fixturesModified.simple)
  })
  .add('fast-deep-equal - simple (not equal)', function () {
    fastDeepEqual(fixtures.simple, fixturesModified.simple)
  })
  .add('fast-equals - simple (not equal)', function () {
    fastEquals(fixtures.simple, fixturesModified.simple)
  })
  .add('lodash.isEqual - simple (not equal)', function () {
    lodashIsEqual(fixtures.simple, fixturesModified.simple)
  })
  .add('_deepEqual - complex (not equal)', function () {
    _deepEqual(fixtures.complex, fixturesModified.complex)
  })
  .add('fast-deep-equal - complex (not equal)', function () {
    fastDeepEqual(fixtures.complex, fixturesModified.complex)
  })
  .add('fast-equals - complex (not equal)', function () {
    fastEquals(fixtures.complex, fixturesModified.complex)
  })
  .add('lodash.isEqual - complex (not equal)', function () {
    lodashIsEqual(fixtures.complex, fixturesModified.complex)
  })
  .add('_deepEqual - array (not equal)', function () {
    _deepEqual(fixtures.array, fixturesModified.array)
  })
  .add('fast-deep-equal - array (not equal)', function () {
    fastDeepEqual(fixtures.array, fixturesModified.array)
  })
  .add('fast-equals - array (not equal)', function () {
    fastEquals(fixtures.array, fixturesModified.array)
  })
  .add('lodash.isEqual - array (not equal)', function () {
    lodashIsEqual(fixtures.array, fixturesModified.array)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(
      '\nFastest unequal objects deepEqual implementation is ' + this.filter('fastest').map('name')
    )
    console.log(
      'Slowest unequal objects deepEqual implementation is ' + this.filter('slowest').map('name')
    )
  })
  .run({ async: false })
