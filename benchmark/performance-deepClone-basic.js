/**
 * Performance Benchmark for _deepClone - Basic Tests
 *
 * This benchmark tests the performance of our _deepClone implementation
 * against popular libraries on basic data structures.
 */
import Benchmark from 'benchmark'
import fastCopy from 'fast-copy'
import lodashCloneDeep from 'lodash.clonedeep'
import rfdc from 'rfdc'

import { _deepClone } from '../build/utils.js'

// Initialize RFDC
const clone = rfdc({ circles: true, proto: true })

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
    date: new Date(),
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

const fixtures = {
  simple: createSimpleFixture(),
  complex: createComplexFixture(),
  array: createArrayFixture(),
}

// Run benchmarks
console.log('Running deepClone basic performance benchmarks...\n')

new Benchmark.Suite('deepClone - Basic Tests')
  .add('_deepClone - simple', function () {
    _deepClone(fixtures.simple)
  })
  .add('rfdc - simple', function () {
    clone(fixtures.simple)
  })
  .add('fast-copy - simple', function () {
    fastCopy(fixtures.simple)
  })
  .add('lodash.cloneDeep - simple', function () {
    lodashCloneDeep(fixtures.simple)
  })
  .add('_deepClone - complex', function () {
    _deepClone(fixtures.complex)
  })
  .add('rfdc - complex', function () {
    clone(fixtures.complex)
  })
  .add('fast-copy - complex', function () {
    fastCopy(fixtures.complex)
  })
  .add('lodash.cloneDeep - complex', function () {
    lodashCloneDeep(fixtures.complex)
  })
  .add('_deepClone - array', function () {
    _deepClone(fixtures.array)
  })
  .add('rfdc - array', function () {
    clone(fixtures.array)
  })
  .add('fast-copy - array', function () {
    fastCopy(fixtures.array)
  })
  .add('lodash.cloneDeep - array', function () {
    lodashCloneDeep(fixtures.array)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('\nFastest basic deepClone implementation is ' + this.filter('fastest').map('name'))
    console.log('Slowest basic deepClone implementation is ' + this.filter('slowest').map('name'))
  })
  .run({ async: false })
