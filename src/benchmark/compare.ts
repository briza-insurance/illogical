/**
 * Compares two benchmark result files and prints a delta table.
 *
 * Usage:
 *   node --import tsx benchmark/compare.ts benchmark/results-baseline.json benchmark/results-current.json
 */

import { readFileSync } from 'fs'

interface BenchResult {
  throughput?: { mean: number }
}

type BenchResultFile = Record<string, BenchResult>

const [, , baselinePath, currentPath] = process.argv

if (!baselinePath || !currentPath) {
  console.error(
    'Usage: node --import tsx benchmark/compare.ts <baseline.json> <current.json>'
  )
  process.exit(1)
}

const baseline: BenchResultFile = JSON.parse(
  readFileSync(baselinePath, 'utf-8')
)
const current: BenchResultFile = JSON.parse(readFileSync(currentPath, 'utf-8'))

function formatHz(hz: number): string {
  if (hz >= 1_000_000) {
    return `${(hz / 1_000_000).toFixed(2)}M`
  }
  if (hz >= 1_000) {
    return `${(hz / 1_000).toFixed(2)}K`
  }
  return hz.toFixed(2)
}

const allKeys = [
  ...new Set([...Object.keys(baseline), ...Object.keys(current)]),
].sort()
const groups = [...new Set(allKeys.map((k) => k.split(' > ')[0]))]

let faster = 0
let slower = 0
let unchanged = 0

for (const group of groups) {
  const groupKeys = allKeys.filter((k) => k.startsWith(`${group} > `))

  console.log(`\n${group}`)
  console.log('─'.repeat(90))
  console.log(
    'Expression'.padEnd(46) +
      'Baseline'.padStart(16) +
      'Current'.padStart(16) +
      'Delta'.padStart(10) +
      'Verdict'.padStart(10)
  )
  console.log('─'.repeat(90))

  for (const key of groupKeys) {
    const label = key.replace(`${group} > `, '')
    const base = baseline[key]
    const cur = current[key]

    if (!base) {
      const curHz = cur.throughput ? formatHz(cur.throughput.mean) : 'N/A'
      console.log(
        label.padEnd(46) +
          '—'.padStart(16) +
          curHz.padStart(16) +
          'NEW'.padStart(10)
      )
      continue
    }
    if (!cur) {
      const baseHz = base.throughput ? formatHz(base.throughput.mean) : 'N/A'
      console.log(
        label.padEnd(46) +
          baseHz.padStart(16) +
          '—'.padStart(16) +
          'REMOVED'.padStart(10)
      )
      continue
    }

    if (!base.throughput || !cur.throughput) {
      console.log(
        label.padEnd(46) +
          'N/A'.padStart(16) +
          'N/A'.padStart(16) +
          'N/A'.padStart(10) +
          'N/A'.padStart(10)
      )
      continue
    }

    const ratio = cur.throughput.mean / base.throughput.mean
    const pct = ((ratio - 1) * 100).toFixed(1)
    const sign = ratio >= 1 ? '+' : ''
    const deltaStr = `${sign}${pct}%`

    let verdict: string
    if (ratio > 1.05) {
      verdict = 'faster'
      faster++
    } else if (ratio < 0.95) {
      verdict = 'SLOWER'
      slower++
    } else {
      verdict = '~same'
      unchanged++
    }

    console.log(
      label.padEnd(46) +
        `${formatHz(base.throughput.mean)} ops/s`.padStart(16) +
        `${formatHz(cur.throughput.mean)} ops/s`.padStart(16) +
        deltaStr.padStart(10) +
        verdict.padStart(10)
    )
  }
}

console.log('\n' + '─'.repeat(90))
console.log(`faster: ${faster}  slower: ${slower}  unchanged: ${unchanged}`)
console.log()
