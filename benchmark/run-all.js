/**
 * Master Script to Run All Benchmarks
 *
 * This script runs all benchmark tests in sequence and provides a comprehensive
 * report of correctness and performance results.
 */
import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// List of all benchmark files to run
const benchmarkFiles = [
  'correctness-deepEqual.js',
  'correctness-deepClone.js',
  'performance-deepEqual-basic.js',
  'performance-deepEqual-specialized.js',
  'performance-deepClone-basic.js',
  'performance-deepClone-specialized.js',
]

// Helper function to run a single benchmark file
function runBenchmark(filename) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`RUNNING: ${filename}`)
    console.log(`${'='.repeat(80)}\n`)

    const child = spawn('node', [join(__dirname, filename)], {
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', code => {
      if (code === 0) {
        console.log(`\n✓ ${filename} completed successfully`)
        resolve()
      } else {
        console.log(`\n✗ ${filename} failed with code ${code}`)
        reject(new Error(`${filename} failed with code ${code}`))
      }
    })

    child.on('error', error => {
      console.log(`\n✗ ${filename} failed with error: ${error.message}`)
      reject(error)
    })
  })
}

// Main execution function
async function runAllBenchmarks() {
  console.log('🚀 Starting comprehensive benchmark suite...\n')

  const startTime = Date.now()
  const results = {
    passed: 0,
    failed: 0,
    errors: [],
  }

  for (const filename of benchmarkFiles) {
    try {
      await runBenchmark(filename)
      results.passed++
    } catch (error) {
      results.failed++
      results.errors.push({ filename, error: error.message })
    }
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  // Print final summary
  console.log(`\n${'='.repeat(80)}`)
  console.log('FINAL BENCHMARK SUMMARY')
  console.log(`${'='.repeat(80)}\n`)

  console.log(`Total benchmarks: ${benchmarkFiles.length}`)
  console.log(`Passed: ${results.passed}`)
  console.log(`Failed: ${results.failed}`)
  console.log(`Total time: ${duration} seconds`)

  if (results.errors.length > 0) {
    console.log('\nFailed benchmarks:')
    results.errors.forEach(error => {
      console.log(`  - ${error.filename}: ${error.error}`)
    })
  }

  console.log(`\n${'='.repeat(80)}`)

  if (results.failed > 0) {
    process.exit(1)
  } else {
    console.log('🎉 All benchmarks completed successfully!')
    process.exit(0)
  }
}

// Run the benchmarks
runAllBenchmarks().catch(error => {
  console.error('Fatal error running benchmarks:', error)
  process.exit(1)
})
