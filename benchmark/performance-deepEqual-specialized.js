/**
 * Performance Benchmark for _deepEqual - Specialized Tests
 * 
 * This benchmark tests the performance of our _deepEqual implementation
 * against popular libraries on specialized data structures like TypedArrays,
 * Maps, and Sets.
 */

import Benchmark from 'benchmark';
import fastDeepEqual from 'fast-deep-equal';
import { deepEqual as fastEquals } from 'fast-equals';
import lodashIsEqual from 'lodash.isequal';
import { _deepEqual } from '../build/utils.js';

// Create specialized test fixtures
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

// Create large data structures for performance testing
const createLargeTypedArrayFixture = () => {
  const size = 10000;
  return {
    int8Array: new Int8Array(size),
    uint8Array: new Uint8Array(size),
    float32Array: new Float32Array(size),
    float64Array: new Float64Array(size),
  };
};

const createLargeMapFixture = () => {
  const map = new Map();
  for (let i = 0; i < 1000; i++) {
    map.set(`key${i}`, {
      id: i,
      name: `Item ${i}`,
      data: new Array(10).fill(i)
    });
  }
  return map;
};

const createLargeSetFixture = () => {
  const set = new Set();
  for (let i = 0; i < 1000; i++) {
    set.add({
      id: i,
      name: `Item ${i}`,
      value: i % 2 === 0 ? { even: true } : { odd: true }
    });
  }
  return set;
};

// Create equal fixtures for equality testing
const fixtures = {
  typedArrays: createTypedArrayFixture(),
  mapsAndSets: createMapsAndSetsFixture(),
  largeTypedArrays: createLargeTypedArrayFixture(),
  largeMap: createLargeMapFixture(),
  largeSet: createLargeSetFixture()
};

const fixtures2 = {
  typedArrays: createTypedArrayFixture(),
  mapsAndSets: createMapsAndSetsFixture(),
  largeTypedArrays: createLargeTypedArrayFixture(),
  largeMap: createLargeMapFixture(),
  largeSet: createLargeSetFixture()
};

// Create modified fixtures for inequality testing
const createModifiedTypedArrayFixture = () => {
  const fixture = createTypedArrayFixture();
  fixture.int8Array[0] = 99; // Modify one element
  return fixture;
};

const createModifiedMapsAndSetsFixture = () => {
  const fixture = createMapsAndSetsFixture();
  fixture.map.set('extra', 'value'); // Add extra key
  return fixture;
};

const fixturesModified = {
  typedArrays: createModifiedTypedArrayFixture(),
  mapsAndSets: createModifiedMapsAndSetsFixture(),
};

// Run benchmarks
console.log('Running deepEqual specialized performance benchmarks...\n');

new Benchmark.Suite('deepEqual - TypedArrays (Equal)')
  .add('_deepEqual - typedArrays (equal)', function() {
    _deepEqual(fixtures.typedArrays, fixtures2.typedArrays);
  })
  .add('fast-deep-equal - typedArrays (equal)', function() {
    fastDeepEqual(fixtures.typedArrays, fixtures2.typedArrays);
  })
  .add('fast-equals - typedArrays (equal)', function() {
    fastEquals(fixtures.typedArrays, fixtures2.typedArrays);
  })
  .add('lodash.isEqual - typedArrays (equal)', function() {
    lodashIsEqual(fixtures.typedArrays, fixtures2.typedArrays);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest TypedArrays (equal) deepEqual implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest TypedArrays (equal) deepEqual implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });

console.log('\n' + '='.repeat(60) + '\n');

new Benchmark.Suite('deepEqual - TypedArrays (Unequal)')
  .add('_deepEqual - typedArrays (not equal)', function() {
    _deepEqual(fixtures.typedArrays, fixturesModified.typedArrays);
  })
  .add('fast-deep-equal - typedArrays (not equal)', function() {
    fastDeepEqual(fixtures.typedArrays, fixturesModified.typedArrays);
  })
  .add('fast-equals - typedArrays (not equal)', function() {
    fastEquals(fixtures.typedArrays, fixturesModified.typedArrays);
  })
  .add('lodash.isEqual - typedArrays (not equal)', function() {
    lodashIsEqual(fixtures.typedArrays, fixturesModified.typedArrays);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest TypedArrays (unequal) deepEqual implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest TypedArrays (unequal) deepEqual implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });

console.log('\n' + '='.repeat(60) + '\n');

new Benchmark.Suite('deepEqual - Maps and Sets (Equal)')
  .add('_deepEqual - mapsAndSets (equal)', function() {
    _deepEqual(fixtures.mapsAndSets, fixtures2.mapsAndSets);
  })
  .add('fast-deep-equal - mapsAndSets (equal)', function() {
    fastDeepEqual(fixtures.mapsAndSets, fixtures2.mapsAndSets);
  })
  .add('fast-equals - mapsAndSets (equal)', function() {
    fastEquals(fixtures.mapsAndSets, fixtures2.mapsAndSets);
  })
  .add('lodash.isEqual - mapsAndSets (equal)', function() {
    lodashIsEqual(fixtures.mapsAndSets, fixtures2.mapsAndSets);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest Maps/Sets (equal) deepEqual implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest Maps/Sets (equal) deepEqual implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });

console.log('\n' + '='.repeat(60) + '\n');

new Benchmark.Suite('deepEqual - Maps and Sets (Unequal)')
  .add('_deepEqual - mapsAndSets (not equal)', function() {
    _deepEqual(fixtures.mapsAndSets, fixturesModified.mapsAndSets);
  })
  .add('fast-deep-equal - mapsAndSets (not equal)', function() {
    fastDeepEqual(fixtures.mapsAndSets, fixturesModified.mapsAndSets);
  })
  .add('fast-equals - mapsAndSets (not equal)', function() {
    fastEquals(fixtures.mapsAndSets, fixturesModified.mapsAndSets);
  })
  .add('lodash.isEqual - mapsAndSets (not equal)', function() {
    lodashIsEqual(fixtures.mapsAndSets, fixturesModified.mapsAndSets);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest Maps/Sets (unequal) deepEqual implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest Maps/Sets (unequal) deepEqual implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });

console.log('\n' + '='.repeat(60) + '\n');

new Benchmark.Suite('deepEqual - Large Data Structures')
  .add('_deepEqual - largeTypedArrays', function() {
    _deepEqual(fixtures.largeTypedArrays, fixtures2.largeTypedArrays);
  })
  .add('fast-deep-equal - largeTypedArrays', function() {
    fastDeepEqual(fixtures.largeTypedArrays, fixtures2.largeTypedArrays);
  })
  .add('fast-equals - largeTypedArrays', function() {
    fastEquals(fixtures.largeTypedArrays, fixtures2.largeTypedArrays);
  })
  .add('lodash.isEqual - largeTypedArrays', function() {
    lodashIsEqual(fixtures.largeTypedArrays, fixtures2.largeTypedArrays);
  })
  .add('_deepEqual - largeMap', function() {
    _deepEqual(fixtures.largeMap, fixtures2.largeMap);
  })
  .add('fast-deep-equal - largeMap', function() {
    fastDeepEqual(fixtures.largeMap, fixtures2.largeMap);
  })
  .add('fast-equals - largeMap', function() {
    fastEquals(fixtures.largeMap, fixtures2.largeMap);
  })
  .add('lodash.isEqual - largeMap', function() {
    lodashIsEqual(fixtures.largeMap, fixtures2.largeMap);
  })
  .add('_deepEqual - largeSet', function() {
    _deepEqual(fixtures.largeSet, fixtures2.largeSet);
  })
  .add('fast-deep-equal - largeSet', function() {
    fastDeepEqual(fixtures.largeSet, fixtures2.largeSet);
  })
  .add('fast-equals - largeSet', function() {
    fastEquals(fixtures.largeSet, fixtures2.largeSet);
  })
  .add('lodash.isEqual - largeSet', function() {
    lodashIsEqual(fixtures.largeSet, fixtures2.largeSet);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest Large Data deepEqual implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest Large Data deepEqual implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });