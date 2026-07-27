import fs from 'fs'
import lodashIsEqual from 'lodash.isequal'
import { createRequire } from 'module'
import path from 'path'
import { performance } from 'perf_hooks'
import ts from 'typescript'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const NEW_UTILS_PATH = path.resolve(__dirname, '../src/utils.ts')
const OLD_UTILS_PATH = path.resolve(__dirname, './baselines/utils.previous.ts')

const compileOptions = {
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    esModuleInterop: true,
    downlevelIteration: true,
  },
}

const loadModuleFromTs = (filePath, label) => {
  const source = fs.readFileSync(filePath, 'utf8')
  const { outputText } = ts.transpileModule(source, compileOptions)
  const module = { exports: {} }
  try {
    const fn = new Function('module', 'exports', 'require', outputText)
    fn(module, module.exports, require)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to evaluate ${label}: ${message}`)
  }
  return module.exports
}

const newUtils = loadModuleFromTs(NEW_UTILS_PATH, 'new-utils')
const oldUtils = loadModuleFromTs(OLD_UTILS_PATH, 'old-utils')

const newDeepEqual = newUtils._deepEqual
const oldDeepEqual = oldUtils._deepEqual
const newDeepClone = newUtils._deepClone
const oldDeepClone = oldUtils._deepClone

if (!newDeepEqual || !oldDeepEqual || !newDeepClone || !oldDeepClone) {
  throw new Error('Missing deep equal/clone exports in loaded modules')
}

const createCircularPair = (valueA, valueB) => {
  const a = { value: valueA }
  const b = { value: valueB }
  a.self = a
  b.self = b
  return { a, b }
}

const equalityCases = [
  { name: 'Primitives equal', a: 42, b: 42 },
  { name: 'Primitives not equal', a: 42, b: 7 },
  { name: 'NaN equality', a: NaN, b: NaN },
  { name: 'Object equal', a: { a: 1, b: 2 }, b: { a: 1, b: 2 } },
  { name: 'Object not equal', a: { a: 1 }, b: { a: 2 } },
  { name: 'Array equal', a: [1, 2, 3], b: [1, 2, 3] },
  { name: 'Array not equal', a: [1, 2, 3], b: [1, 2, 4] },
  {
    name: 'Map equal',
    a: new Map([
      ['one', { nested: 1 }],
      ['two', 2],
    ]),
    b: new Map([
      ['one', { nested: 1 }],
      ['two', 2],
    ]),
  },
  {
    name: 'Set primitives not equal',
    a: new Set([1, 2, 3]),
    b: new Set([1, 2, 4]),
  },
  {
    name: 'TypedArray equal',
    a: new Int16Array([1, 2, 3, 4]),
    b: new Int16Array([1, 2, 3, 4]),
  },
  {
    name: 'TypedArray different constructors',
    a: new Int16Array([1, 2, 3, 4]),
    b: new Uint16Array([1, 2, 3, 4]),
  },
  {
    name: 'Date objects',
    a: new Date('2023-01-01T00:00:00Z'),
    b: new Date('2023-01-02T00:00:00Z'),
  },
  {
    name: 'RegExp equal',
    a: /hello/gi,
    b: /hello/gi,
  },
  (() => {
    const { a, b } = createCircularPair(1, 1)
    return { name: 'Circular equal', a, b }
  })(),
  (() => {
    const { a, b } = createCircularPair(1, 2)
    return { name: 'Circular not equal', a, b }
  })(),
]

const cloneCases = [
  { name: 'Number primitive', input: 42, shouldClone: false },
  { name: 'String primitive', input: 'hello', shouldClone: false },
  { name: 'Boolean primitive', input: true, shouldClone: false },
  { name: 'Simple object', input: { a: 1, b: { c: 2 } }, shouldClone: true },
  { name: 'Array', input: [1, 2, { nested: [3] }], shouldClone: true },
  {
    name: 'Date',
    input: new Date('2024-02-02T00:00:00Z'),
    shouldClone: true,
  },
  { name: 'Regex', input: /compare/gi, shouldClone: true },
  {
    name: 'Map',
    input: new Map([[{ id: 1 }, new Set([1, 2])]]),
    shouldClone: true,
  },
  { name: 'Set', input: new Set([{ a: 1 }, { b: 2 }]), shouldClone: true },
  {
    name: 'TypedArray',
    input: new Uint8Array([1, 2, 3, 4]),
    shouldClone: true,
  },
  (() => {
    const circular = { a: 1 }
    circular.self = circular
    return { name: 'Circular', input: circular, shouldClone: true }
  })(),
]

const formatOps = ops => `${ops.toLocaleString('en-US', { maximumFractionDigits: 1 })} ops/sec`

const evaluateEquality = () => {
  const results = equalityCases.map(testCase => {
    const expected = lodashIsEqual(testCase.a, testCase.b)
    let newResult
    let oldResult
    let newError = null
    let oldError = null

    try {
      newResult = newDeepEqual(testCase.a, testCase.b)
    } catch (error) {
      newResult = false
      newError = error instanceof Error ? error.message : String(error)
    }

    try {
      oldResult = oldDeepEqual(testCase.a, testCase.b)
    } catch (error) {
      oldResult = false
      oldError = error instanceof Error ? error.message : String(error)
    }

    const newPass = !newError && newResult === expected
    const oldPass = !oldError && oldResult === expected

    return {
      name: testCase.name,
      expected,
      newResult,
      oldResult,
      newPass,
      oldPass,
      newDetail: newError ? newError : newPass ? '' : `expected ${expected}, got ${newResult}`,
      oldDetail: oldError ? oldError : oldPass ? '' : `expected ${expected}, got ${oldResult}`,
    }
  })

  return {
    newPasses: results.filter(r => r.newPass).length,
    oldPasses: results.filter(r => r.oldPass).length,
    cases: results,
  }
}

const mutateAndCheckIsolation = (original, clone, errors) => {
  if (clone === null || typeof clone !== 'object') return

  if (Array.isArray(clone)) {
    const before = original.length
    clone.push('__mutation__')
    if (original.length !== before) {
      errors.push('Array mutation affected original')
    }
    return
  }

  if (clone instanceof Map && original instanceof Map) {
    const sizeBefore = original.size
    try {
      clone.set('__mutation__', 1)
      if (original.size !== sizeBefore) {
        errors.push('Map mutation affected original')
      }
    } catch (mapError) {
      errors.push(
        `Map mutation failed: ${mapError instanceof Error ? mapError.message : String(mapError)}`
      )
    }
    return
  }

  if (clone instanceof Set && original instanceof Set) {
    const sizeBefore = original.size
    try {
      clone.add('__mutation__')
      if (original.size !== sizeBefore) {
        errors.push('Set mutation affected original')
      }
    } catch (setError) {
      errors.push(
        `Set mutation failed: ${setError instanceof Error ? setError.message : String(setError)}`
      )
    }
    return
  }

  if (ArrayBuffer.isView(clone)) {
    const originalFirst = original[0]
    clone[0] = 999
    if (original[0] === 999 && originalFirst !== 999) {
      errors.push('TypedArray mutation affected original')
    }
    return
  }

  if (
    clone instanceof Date &&
    original instanceof Date &&
    typeof clone.getTime === 'function' &&
    typeof clone.setTime === 'function'
  ) {
    try {
      const before = original.getTime()
      const cloneBefore = clone.getTime()
      clone.setTime(cloneBefore + 1000)
      if (original.getTime() !== before) {
        errors.push('Date mutation affected original')
      }
    } catch (dateError) {
      errors.push(
        `Date mutation failed: ${
          dateError instanceof Error ? dateError.message : String(dateError)
        }`
      )
    }
    return
  }

  clone.__mutation__ = true
  if (original.__mutation__ === true) {
    errors.push('Object mutation affected original')
  }
}

const analyzeCloneResult = (label, source, clone, shouldClone) => {
  const errors = []
  const isObject = source !== null && typeof source === 'object'

  if (!shouldClone && clone !== source) {
    errors.push('Primitive should return original reference')
  }

  if (shouldClone) {
    if (clone === source) {
      errors.push('Clone shares reference with source')
    }

    let equal = true
    try {
      equal = lodashIsEqual(source, clone)
    } catch (compareError) {
      equal = false
      errors.push(
        `Deep equality threw: ${
          compareError instanceof Error ? compareError.message : String(compareError)
        }`
      )
    }
    if (!equal) {
      errors.push('Clone is not deeply equal to source')
    }

    if (
      isObject &&
      clone !== null &&
      typeof clone === 'object' &&
      clone.constructor !== source.constructor
    ) {
      errors.push(
        `Constructor mismatch (${source.constructor?.name} vs ${clone.constructor?.name})`
      )
    }

    mutateAndCheckIsolation(source, clone, errors)
  }

  return {
    label,
    errors,
    pass: errors.length === 0,
  }
}

const evaluateClone = () => {
  const results = cloneCases.map(testCase => {
    let newClone
    let oldClone
    let newError = null
    let oldError = null

    try {
      newClone = newDeepClone(testCase.input)
    } catch (error) {
      newClone = null
      newError = error instanceof Error ? error.message : String(error)
    }

    try {
      oldClone = oldDeepClone(testCase.input)
    } catch (error) {
      oldClone = null
      oldError = error instanceof Error ? error.message : String(error)
    }

    const newAnalysis =
      newError === null
        ? analyzeCloneResult(testCase.name, testCase.input, newClone, testCase.shouldClone)
        : { label: testCase.name, errors: [newError], pass: false }

    const oldAnalysis =
      oldError === null
        ? analyzeCloneResult(testCase.name, testCase.input, oldClone, testCase.shouldClone)
        : { label: testCase.name, errors: [oldError], pass: false }

    return {
      name: testCase.name,
      newPass: newAnalysis.pass,
      oldPass: oldAnalysis.pass,
      newErrors: newAnalysis.errors,
      oldErrors: oldAnalysis.errors,
    }
  })

  return {
    newPasses: results.filter(r => r.newPass).length,
    oldPasses: results.filter(r => r.oldPass).length,
    cases: results,
  }
}

const measureOps = (fn, scenario) => {
  const { args, iterations } = scenario
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn(...args)
  }
  const duration = performance.now() - start
  return (iterations / duration) * 1000
}

const equalityPerfScenarios = [
  {
    name: 'Array equal (1K items)',
    args: [Array.from({ length: 1000 }, (_, i) => i), Array.from({ length: 1000 }, (_, i) => i)],
    iterations: 5000,
  },
  {
    name: 'Array diff (1K items)',
    args: [
      Array.from({ length: 1000 }, (_, i) => i),
      Array.from({ length: 1000 }, (_, i) => (i === 500 ? -1 : i)),
    ],
    iterations: 5000,
  },
  {
    name: 'Nested object equal',
    args: [
      {
        users: Array.from({ length: 50 }, (_, i) => ({
          id: i,
          tags: ['a', 'b'],
        })),
      },
      {
        users: Array.from({ length: 50 }, (_, i) => ({
          id: i,
          tags: ['a', 'b'],
        })),
      },
    ],
    iterations: 4000,
  },
  {
    name: 'Map diff',
    args: [
      new Map(Array.from({ length: 200 }, (_, i) => [i, { nested: i }])),
      new Map(Array.from({ length: 200 }, (_, i) => [i, { nested: i + 1 }])),
    ],
    iterations: 1000,
  },
]

const clonePerfScenarios = [
  {
    name: 'Object with arrays',
    args: [
      {
        items: Array.from({ length: 200 }, (_, i) => ({
          id: i,
          tags: ['tag', i, { nested: true }],
        })),
      },
    ],
    iterations: 500,
  },
  {
    name: 'Set of objects',
    args: [new Set(Array.from({ length: 200 }, (_, i) => ({ id: i, data: i * 2 })))],
    iterations: 300,
  },
  {
    name: 'TypedArray 64K',
    args: [new Uint8Array(64 * 1024)],
    iterations: 200,
  },
]

const runPerfSuite = () => {
  const equalityResults = equalityPerfScenarios.map(scenario => {
    const newOps = measureOps(newDeepEqual, scenario)
    const oldOps = measureOps(oldDeepEqual, scenario)
    return { ...scenario, newOps, oldOps }
  })

  const cloneResults = clonePerfScenarios.map(scenario => {
    const newOps = measureOps(value => newDeepClone(value), scenario)
    const oldOps = measureOps(value => oldDeepClone(value), scenario)
    return { ...scenario, newOps, oldOps }
  })

  return { equalityResults, cloneResults }
}

const printTable = rows => {
  const header = `| Case | New | Old |`
  const separator = `| --- | --- | --- |`
  console.log(header)
  console.log(separator)
  rows.forEach(row => {
    console.log(`| ${row.label} | ${row.newValue} | ${row.oldValue} |`)
  })
  console.log('')
}

const equalitySummary = evaluateEquality()
const cloneSummary = evaluateClone()
const perfSummary = runPerfSuite()

console.log('\n=== Correctness: _deepEqual ===')
console.log(
  `New: ${equalitySummary.newPasses}/${equalityCases.length} cases | Old: ${equalitySummary.oldPasses}/${equalityCases.length} cases`
)
printTable(
  equalitySummary.cases.map(testCase => ({
    label: testCase.name,
    newValue: testCase.newPass ? 'PASS' : `FAIL (${testCase.newDetail})`,
    oldValue: testCase.oldPass ? 'PASS' : `FAIL (${testCase.oldDetail})`,
  }))
)

console.log('=== Correctness: _deepClone ===')
console.log(
  `New: ${cloneSummary.newPasses}/${cloneCases.length} cases | Old: ${cloneSummary.oldPasses}/${cloneCases.length} cases`
)
printTable(
  cloneSummary.cases.map(testCase => ({
    label: testCase.name,
    newValue: testCase.newPass ? 'PASS' : `FAIL (${testCase.newErrors.join('; ')})`,
    oldValue: testCase.oldPass ? 'PASS' : `FAIL (${testCase.oldErrors.join('; ')})`,
  }))
)

console.log('=== Performance: _deepEqual ===')
printTable(
  perfSummary.equalityResults.map(result => ({
    label: result.name,
    newValue: formatOps(result.newOps),
    oldValue: formatOps(result.oldOps),
  }))
)

console.log('=== Performance: _deepClone ===')
printTable(
  perfSummary.cloneResults.map(result => ({
    label: result.name,
    newValue: formatOps(result.newOps),
    oldValue: formatOps(result.oldOps),
  }))
)

const improvementReport = {
  equality: equalitySummary.newPasses - equalitySummary.oldPasses,
  clone: cloneSummary.newPasses - cloneSummary.oldPasses,
  equalityPerf: perfSummary.equalityResults.map(r => ({
    name: r.name,
    delta: r.newOps - r.oldOps,
  })),
  clonePerf: perfSummary.cloneResults.map(r => ({
    name: r.name,
    delta: r.newOps - r.oldOps,
  })),
}

fs.writeFileSync(
  path.resolve(__dirname, './compare-utils-results.json'),
  JSON.stringify(improvementReport, null, 2)
)

console.log('Detailed deltas saved to benchmark/compare-utils-results.json')
