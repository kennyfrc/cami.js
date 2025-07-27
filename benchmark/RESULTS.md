# Benchmark Results: _deepEqual and _deepClone vs Popular Libraries

This document summarizes the performance and correctness benchmarks comparing our `_deepEqual` and `_deepClone` implementations against popular libraries.

## Libraries Tested

### deepEqual Libraries
- **_deepEqual** - Our implementation
- **fast-deep-equal** - Popular fast equality library
- **fast-equals** - Comprehensive equality library
- **lodash.isEqual** - Lodash's equality function

### deepClone Libraries
- **_deepClone** - Our implementation
- **rfdc** - Really Fast Deep Clone
- **fast-copy** - Fast copying library
- **lodash.cloneDeep** - Lodash's deep clone function

## Correctness Results

### _deepEqual Correctness (57 test cases)

| Library | Passed | Failed | Errors | Percentage | Notes |
|---------|--------|--------|--------|------------|-------|
| **lodash.isEqual** | 57/57 | 0 | 0 | **100.0%** | ✅ Perfect correctness |
| **_deepEqual** | 56/57 | 0 | 1 | **98.2%** | ⚠️ Circular reference issue |
| **fast-equals** | 55/57 | 0 | 2 | **96.5%** | ⚠️ Circular reference issue |
| **fast-deep-equal** | 52/57 | 3 | 2 | **91.2%** | ❌ Map/Set + circular issues |

**Key Issues:**
- **fast-deep-equal**: Fails on Map and Set comparisons (returns true for different values)
- **Circular references**: All libraries except lodash.isEqual fail with stack overflow

### _deepClone Correctness (32 test cases)

| Library | Passed | Failed | Errors | Percentage | Notes |
|---------|--------|--------|--------|------------|-------|
| **_deepClone** | 31/32 | 1 | 0 | **96.9%** | ⚠️ Circular reference issue |
| **fast-copy** | 31/32 | 1 | 0 | **96.9%** | ⚠️ Circular reference issue |
| **lodash.cloneDeep** | 29/32 | 3 | 0 | **90.6%** | ❌ Functions + circular issues |
| **rfdc** | 24/32 | 8 | 0 | **75.0%** | ❌ RegExp, TypedArrays + more |

**Key Issues:**
- **rfdc**: Fails on RegExp and TypedArrays (converts to plain objects)
- **lodash.cloneDeep**: Fails on functions (doesn't preserve function references)
- **Circular references**: All libraries fail with stack overflow

## Performance Results

### _deepEqual Performance (ops/sec)

#### Simple Objects (Equal)
| Rank | Library | Performance | Relative |
|------|---------|-------------|----------|
| 🥇 | **fast-deep-equal** | 2,868,038 ops/sec | 100% |
| 🥈 | **_deepEqual** | 2,649,877 ops/sec | 92.4% |
| 🥉 | **fast-equals** | 2,500,684 ops/sec | 87.2% |
| 4 | **lodash.isEqual** | 734,272 ops/sec | 25.6% |

#### Arrays (Equal)
| Rank | Library | Performance | Relative |
|------|---------|-------------|----------|
| 🥇 | **_deepEqual** | 4,103 ops/sec | 100% |
| 🥈 | **fast-equals** | 3,567 ops/sec | 87.0% |
| 🥉 | **fast-deep-equal** | 3,497 ops/sec | 85.2% |
| 4 | **lodash.isEqual** | 976 ops/sec | 23.8% |

#### Arrays (Unequal) - Early Exit Performance
| Rank | Library | Performance | Relative |
|------|---------|-------------|----------|
| 🥇 | **_deepEqual** | 62,613,419 ops/sec | 100% |
| 🥈 | **fast-deep-equal** | 52,391,922 ops/sec | 83.7% |
| 🥉 | **fast-equals** | 30,906,908 ops/sec | 49.4% |
| 4 | **lodash.isEqual** | 29,225,165 ops/sec | 46.7% |

### _deepClone Performance (ops/sec)

#### Simple Objects
| Rank | Library | Performance | Relative |
|------|---------|-------------|----------|
| 🥇 | **rfdc** | 3,035,268 ops/sec | 100% |
| 🥈 | **_deepClone** | 2,491,543 ops/sec | 82.1% |
| 🥉 | **fast-copy** | 1,512,333 ops/sec | 49.8% |
| 4 | **lodash.cloneDeep** | 981,021 ops/sec | 32.3% |

#### Complex Objects (with Maps, Sets, Dates, RegExp)
| Rank | Library | Performance | Relative |
|------|---------|-------------|----------|
| 🥇 | **_deepClone** | 760,810 ops/sec | 100% |
| 🥈 | **rfdc** | 516,442 ops/sec | 67.9% |
| 🥉 | **fast-copy** | 445,809 ops/sec | 58.6% |
| 4 | **lodash.cloneDeep** | 200,524 ops/sec | 26.4% |

#### Large Arrays (1000 objects)
| Rank | Library | Performance | Relative |
|------|---------|-------------|----------|
| 🥇 | **rfdc** | 3,615 ops/sec | 100% |
| 🥈 | **_deepClone** | 2,636 ops/sec | 72.9% |
| 🥉 | **fast-copy** | 1,773 ops/sec | 49.0% |
| 4 | **lodash.cloneDeep** | 1,087 ops/sec | 30.1% |

## Summary & Recommendations

### _deepEqual
- **Best Overall**: `_deepEqual` offers excellent performance (2nd fastest on simple objects, fastest on arrays) with very high correctness (98.2%)
- **Performance Winner**: `fast-deep-equal` is fastest on simple objects but has correctness issues with Maps/Sets
- **Correctness Winner**: `lodash.isEqual` has perfect correctness but significantly slower performance
- **Issue**: Circular reference handling needs improvement across all libraries

### _deepClone
- **Best Complex Objects**: `_deepClone` dominates complex object cloning (47% faster than rfdc, 70% faster than fast-copy)
- **Best Simple Objects**: `rfdc` is fastest on simple objects but fails on RegExp and TypedArrays
- **Most Reliable**: `_deepClone` and `fast-copy` tie for highest correctness (96.9%)
- **Issue**: Circular reference handling needs improvement across all libraries

## Optimization Achievements

Our implementations successfully incorporate optimization patterns from fast-equals and other high-performance libraries:

1. **Early exits** for reference equality and type mismatches
2. **Decrementing while loops** for better performance
3. **Constructor-based type detection** for efficiency
4. **Specialized handling** for Arrays, Maps, Sets, TypedArrays
5. **sameValueZero semantics** for NaN handling

The benchmarks demonstrate that our utilities achieve competitive or superior performance while maintaining high correctness across diverse data structures.

---

*Generated: $(date)*
*Test Environment: Node.js v22.14.0, darwin platform*