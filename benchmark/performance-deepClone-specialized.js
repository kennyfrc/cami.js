/**
 * Performance Benchmark for _deepClone - Specialized Tests
 * 
 * This benchmark tests the performance of our _deepClone implementation
 * against popular libraries on specialized data structures like TypedArrays,
 * Maps, and Sets.
 */

import Benchmark from 'benchmark';
import rfdc from 'rfdc';
import fastCopy from 'fast-copy';
import lodashCloneDeep from 'lodash.clonedeep';
import { _deepClone } from '../build/utils.js';

// Initialize RFDC
const clone = rfdc({ circles: true, proto: true });

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

const fixtures = {
  typedArrays: createTypedArrayFixture(),
  mapsAndSets: createMapsAndSetsFixture(),
  largeTypedArrays: createLargeTypedArrayFixture(),
  largeMap: createLargeMapFixture(),
  largeSet: createLargeSetFixture()
};

// Run benchmarks
console.log('Running deepClone specialized performance benchmarks...\n');

new Benchmark.Suite('deepClone - TypedArrays')
  .add('_deepClone - typedArrays', function() {
    _deepClone(fixtures.typedArrays);
  })
  .add('rfdc - typedArrays', function() {
    clone(fixtures.typedArrays);
  })
  .add('fast-copy - typedArrays', function() {
    fastCopy(fixtures.typedArrays);
  })
  .add('lodash.cloneDeep - typedArrays', function() {
    lodashCloneDeep(fixtures.typedArrays);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest TypedArrays deepClone implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest TypedArrays deepClone implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });

console.log('\n' + '='.repeat(60) + '\n');

new Benchmark.Suite('deepClone - Maps and Sets')
  .add('_deepClone - mapsAndSets', function() {
    _deepClone(fixtures.mapsAndSets);
  })
  .add('rfdc - mapsAndSets', function() {
    clone(fixtures.mapsAndSets);
  })
  .add('fast-copy - mapsAndSets', function() {
    fastCopy(fixtures.mapsAndSets);
  })
  .add('lodash.cloneDeep - mapsAndSets', function() {
    lodashCloneDeep(fixtures.mapsAndSets);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest Maps/Sets deepClone implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest Maps/Sets deepClone implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });

console.log('\n' + '='.repeat(60) + '\n');

new Benchmark.Suite('deepClone - Large Data Structures')
  .add('_deepClone - largeTypedArrays', function() {
    _deepClone(fixtures.largeTypedArrays);
  })
  .add('rfdc - largeTypedArrays', function() {
    clone(fixtures.largeTypedArrays);
  })
  .add('fast-copy - largeTypedArrays', function() {
    fastCopy(fixtures.largeTypedArrays);
  })
  .add('lodash.cloneDeep - largeTypedArrays', function() {
    lodashCloneDeep(fixtures.largeTypedArrays);
  })
  .add('_deepClone - largeMap', function() {
    _deepClone(fixtures.largeMap);
  })
  .add('rfdc - largeMap', function() {
    clone(fixtures.largeMap);
  })
  .add('fast-copy - largeMap', function() {
    fastCopy(fixtures.largeMap);
  })
  .add('lodash.cloneDeep - largeMap', function() {
    lodashCloneDeep(fixtures.largeMap);
  })
  .add('_deepClone - largeSet', function() {
    _deepClone(fixtures.largeSet);
  })
  .add('rfdc - largeSet', function() {
    clone(fixtures.largeSet);
  })
  .add('fast-copy - largeSet', function() {
    fastCopy(fixtures.largeSet);
  })
  .add('lodash.cloneDeep - largeSet', function() {
    lodashCloneDeep(fixtures.largeSet);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest Large Data deepClone implementation is ' + this.filter('fastest').map('name'));
    console.log('Slowest Large Data deepClone implementation is ' + this.filter('slowest').map('name'));
  })
  .run({ async: false });