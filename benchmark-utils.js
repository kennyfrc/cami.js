/**
 * Benchmark for deepClone and deepEqual implementations
 * 
 * This benchmark compares our implementations with popular libraries:
 * - RFDC (Really Fast Deep Clone)
 * - fast-deep-equal
 * - lodash.clonedeep
 */

import Benchmark from 'benchmark';
import rfdc from 'rfdc';
import fastEqual from 'fast-deep-equal';
import lodashCloneDeep from 'lodash.clonedeep';
import { _deepClone, _deepEqual } from './src/utils.js';

// Initialize RFDC
const clone = rfdc({ circles: true, proto: true });

// Create test fixtures
const createSimpleFixture = () => ({
  string: 'hello world',
  number: 42,
  boolean: true,
  null: null,
  nested: {
    array: [1, 2, 3],
    object: { a: 1, b: 2 }
  }
});

const createComplexFixture = () => {
  const obj = {
    string: 'hello world',
    number: 42,
    boolean: true,
    date: new Date(),
    regexp: /test/gi,
    array: [1, 2, { a: 1, b: 2 }],
    map: new Map([['key1', 'value1'], ['key2', { nested: true }]]),
    set: new Set([1, 2, { a: 'test' }]),
    nested: {
      level1: {
        level2: {
          level3: {
            value: 'deep nesting'
          }
        }
      }
    }
  };
  
  // Add circular reference
  obj.circular = obj;
  // Add reference to nested object
  obj.reference = obj.nested;
  
  return obj;
};

const createArrayFixture = () => {
  const array = [];
  for (let i = 0; i < 1000; i++) {
    array.push({
      id: i,
      name: `Item ${i}`,
      value: i % 2 === 0 ? { even: true } : { odd: true },
      tags: [`tag-${i}`, `tag-${i + 1}`]
    });
  }
  return array;
};

// Create special data structures for testing TypedArrays, Maps and Sets
const createTypedArrayFixture = () => {
  const buffer = new ArrayBuffer(1024);
  return {
    int8Array: new Int8Array(buffer, 0, 128),
    uint8Array: new Uint8Array(buffer, 128, 128),
    int16Array: new Int16Array(buffer, 256, 64),
    uint16Array: new Uint16Array(buffer, 384, 64),
    int32Array: new Int32Array(buffer, 512, 32),
    float32Array: new Float32Array(buffer, 640, 32),
    float64Array: new Float64Array(buffer, 768, 16),
    dataView: new DataView(buffer, 900, 124)
  };
};

const createMapsAndSetsFixture = () => {
  // Create a complex nested structure with Maps and Sets
  const nestedMap = new Map();
  nestedMap.set('nestedKey', { value: 'nested value' });
  
  const nestedSet = new Set();
  nestedSet.add({ id: 1, name: 'item 1' });
  nestedSet.add({ id: 2, name: 'item 2' });
  
  const map = new Map();
  map.set('key1', 'value1');
  map.set('key2', { nested: true });
  map.set('nestedMap', nestedMap);
  map.set('numberKey', 42);
  
  const set = new Set();
  set.add(1);
  set.add('string value');
  set.add({ id: 1, value: 'object in set' });
  set.add(nestedSet);
  
  // Create circular references
  map.set('circular', map);
  
  return {
    map,
    set,
    nestedMap,
    nestedSet
  };
};

const fixtures = {
  simple: createSimpleFixture(),
  complex: createComplexFixture(),
  array: createArrayFixture(),
};

// Run benchmarks
console.log('Running deepClone benchmarks...');

new Benchmark.Suite('deepClone - Basic Tests')
  .add('_deepClone - simple', function() {
    _deepClone(fixtures.simple);
  })
  .add('rfdc - simple', function() {
    clone(fixtures.simple);
  })
  .add('lodash.cloneDeep - simple', function() {
    lodashCloneDeep(fixtures.simple);
  })
  .add('_deepClone - complex', function() {
    _deepClone(fixtures.complex);
  })
  .add('rfdc - complex', function() {
    clone(fixtures.complex);
  })
  .add('lodash.cloneDeep - complex', function() {
    lodashCloneDeep(fixtures.complex);
  })
  .add('_deepClone - array', function() {
    _deepClone(fixtures.array);
  })
  .add('rfdc - array', function() {
    clone(fixtures.array);
  })
  .add('lodash.cloneDeep - array', function() {
    lodashCloneDeep(fixtures.array);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest basic deepClone implementation is ' + this.filter('fastest').map('name'));
  })
  .run({ async: false });

console.log('\nRunning specialized deepClone benchmarks...');
new Benchmark.Suite('deepClone - Specialized Tests')
  .add('_deepClone - typedArrays', function() {
    _deepClone(fixtures.typedArrays);
  })
  .add('rfdc - typedArrays', function() {
    clone(fixtures.typedArrays);
  })
  .add('lodash.cloneDeep - typedArrays', function() {
    lodashCloneDeep(fixtures.typedArrays);
  })
  .add('_deepClone - mapsAndSets', function() {
    _deepClone(fixtures.mapsAndSets);
  })
  .add('rfdc - mapsAndSets', function() {
    clone(fixtures.mapsAndSets);
  })
  .add('lodash.cloneDeep - mapsAndSets', function() {
    lodashCloneDeep(fixtures.mapsAndSets);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest specialized deepClone implementation is ' + this.filter('fastest').map('name'));
  })
  .run({ async: false });

console.log('\nRunning deepEqual benchmarks...');

// Create equal fixtures for equality testing
const fixtures2 = {
  simple: createSimpleFixture(),
  complex: createComplexFixture(),
  array: createArrayFixture(),
  typedArrays: createTypedArrayFixture(),
  mapsAndSets: createMapsAndSetsFixture()
};

// Slightly modify a copy for inequality testing
const fixturesModified = {
  simple: { ...createSimpleFixture(), extra: 'field' },
  complex: { ...createComplexFixture(), extra: 'field' },
  array: [...createArrayFixture(), { id: 1001 }]
};

new Benchmark.Suite('deepEqual - Basic Tests')
  .add('_deepEqual - simple (equal)', function() {
    _deepEqual(fixtures.simple, fixtures2.simple);
  })
  .add('fast-deep-equal - simple (equal)', function() {
    fastEqual(fixtures.simple, fixtures2.simple);
  })
  .add('_deepEqual - simple (not equal)', function() {
    _deepEqual(fixtures.simple, fixturesModified.simple);
  })
  .add('fast-deep-equal - simple (not equal)', function() {
    fastEqual(fixtures.simple, fixturesModified.simple);
  })
  .add('_deepEqual - complex (equal)', function() {
    _deepEqual(fixtures.complex, fixtures2.complex);
  })
  .add('fast-deep-equal - complex (equal)', function() {
    fastEqual(fixtures.complex, fixtures2.complex);
  })
  .add('_deepEqual - array (equal)', function() {
    _deepEqual(fixtures.array, fixtures2.array);
  })
  .add('fast-deep-equal - array (equal)', function() {
    fastEqual(fixtures.array, fixtures2.array);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest basic deepEqual implementation is ' + this.filter('fastest').map('name'));
  })
  .run({ async: false });

console.log('\nRunning specialized deepEqual benchmarks...');
new Benchmark.Suite('deepEqual - Specialized Tests')
  .add('_deepEqual - typedArrays (equal)', function() {
    _deepEqual(fixtures.typedArrays, fixtures2.typedArrays);
  })
  .add('fast-deep-equal - typedArrays (equal)', function() {
    fastEqual(fixtures.typedArrays, fixtures2.typedArrays);
  })
  .add('_deepEqual - mapsAndSets (equal)', function() {
    _deepEqual(fixtures.mapsAndSets, fixtures2.mapsAndSets);
  })
  .add('fast-deep-equal - mapsAndSets (equal)', function() {
    fastEqual(fixtures.mapsAndSets, fixtures2.mapsAndSets);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest specialized deepEqual implementation is ' + this.filter('fastest').map('name'));
  })
  .run({ async: false });
