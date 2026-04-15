/**
 * Generates a markdown comparison report from two benchmark result files.
 *
 * Usage:
 *   node --import tsx benchmark/report.ts <baseline.json> <improved.json>
 *     --op <evaluate|simplify> [--full] [--out <report.md>]
 *
 * Without --full: top 20 most improved, top 20 least improved, regressions.
 * With    --full: all cases sorted by performance delta (descending), regressions.
 */

import { readFileSync, writeFileSync } from 'fs'

const args = process.argv.slice(2)

const outFlagIdx = args.indexOf('--out')
const outPath = outFlagIdx !== -1 ? args[outFlagIdx + 1] : 'benchmark/report.md'

const opFlagIdx = args.indexOf('--op')
const operation = opFlagIdx !== -1 ? args[opFlagIdx + 1] : undefined

const fullReport = args.includes('--full')

const positional = args.filter(
  (_, i) =>
    i !== outFlagIdx &&
    i !== outFlagIdx + 1 &&
    i !== opFlagIdx &&
    i !== opFlagIdx + 1 &&
    args[i] !== '--full'
)

const [baselinePath, improvedPath] = positional

if (!baselinePath || !improvedPath || !operation) {
  console.error(
    'Usage: node --import tsx benchmark/report.ts <baseline.json> <improved.json>' +
      ' --op <evaluate|simplify> [--full] [--out <report.md>]'
  )
  process.exit(1)
}

interface BenchmarkResult {
  throughput: { mean: number }
}

const baseline: Record<string, BenchmarkResult> = JSON.parse(
  readFileSync(baselinePath, 'utf-8')
)
const improved: Record<string, BenchmarkResult> = JSON.parse(
  readFileSync(improvedPath, 'utf-8')
)

function formatHz(hz: number): string {
  if (hz >= 1_000_000) {
    return `${(hz / 1_000_000).toFixed(2)}M`
  }
  if (hz >= 1_000) {
    return `${(hz / 1_000).toFixed(2)}K`
  }
  return hz.toFixed(2)
}

function formatPct(ratio: number): string {
  const pct = ((ratio - 1) * 100).toFixed(1)
  return `${ratio >= 1 ? '+' : ''}${pct}%`
}

interface Entry {
  key: string
  operation: string
  group: string
  caseName: string
  baseHz: number
  impHz: number
  ratio: number
}

const allKeys = [
  ...new Set([...Object.keys(baseline), ...Object.keys(improved)]),
].sort()

const entries: Entry[] = []

for (const key of allKeys) {
  const base = baseline[key]
  const imp = improved[key]
  if (!base || !imp) {
    continue
  }

  const parts = key.split(' > ')
  const operation = parts[0]
  const group = parts[1]
  const caseName = parts.slice(2).join(' > ')

  entries.push({
    key,
    operation,
    group,
    caseName,
    baseHz: base.throughput.mean,
    impHz: imp.throughput.mean,
    ratio: imp.throughput.mean / base.throughput.mean,
  })
}

const opEntries = entries.filter((e) => e.operation === operation)

function formatMultiplier(ratio: number): string {
  return `${ratio.toFixed(2)}x`
}

function tableRows(rows: Entry[]): string {
  return rows
    .map((e) =>
      [
        `| ${e.group}`,
        e.caseName,
        `${formatHz(e.baseHz)} ops/s`,
        `${formatHz(e.impHz)} ops/s`,
        formatPct(e.ratio),
        `${formatMultiplier(e.ratio)} |`,
      ].join(' | ')
    )
    .join('\n')
}

function tableHeader(): string {
  return [
    '| Group | Case | Baseline | Improved | Delta | Multiplier |',
    '|-------|------|----------|----------|-------|------------|',
  ].join('\n')
}

function regressionsSection(rows: Entry[]): string {
  const worse = [...rows]
    .sort((a, b) => a.ratio - b.ratio)
    .filter((e) => e.ratio < 0.95)
  return worse.length === 0
    ? `_No regressions._`
    : `${tableHeader()}\n${tableRows(worse)}`
}

function opSection(op: string, rows: Entry[]): string {
  const byDesc = [...rows].sort((a, b) => b.ratio - a.ratio)
  const byAsc = [...rows].sort((a, b) => a.ratio - b.ratio)

  return `## ${op}

### Top 20 Most Improved

${tableHeader()}
${tableRows(byDesc.slice(0, 20))}

### Top 20 Least Improved

${tableHeader()}
${tableRows(byAsc.slice(0, 20))}

### Regressions

${regressionsSection(rows)}
`
}

function opSectionFull(op: string, rows: Entry[]): string {
  const byDesc = [...rows].sort((a, b) => b.ratio - a.ratio)

  return `## ${op}

### All Cases (sorted by delta, best first)

${tableHeader()}
${tableRows(byDesc)}

### Regressions

${regressionsSection(rows)}
`
}

const faster = opEntries.filter((e) => e.ratio > 1.05).length
const slower = opEntries.filter((e) => e.ratio < 0.95).length
const unchanged = opEntries.filter(
  (e) => e.ratio >= 0.95 && e.ratio <= 1.05
).length

const baselineFile = baselinePath.split('/').pop()!
const improvedFile = improvedPath.split('/').pop()!

const report = `# Benchmark Comparison Report — ${operation}${fullReport ? ' (full)' : ''}

**Baseline:** \`${baselineFile}\`
**Improved:** \`${improvedFile}\`
**Total cases compared:** ${opEntries.length}

## Summary

| | Count |
|---|---|
| Faster (>+5%) | ${faster} |
| Slower (>-5%) | ${slower} |
| Unchanged | ${unchanged} |

---

${fullReport ? opSectionFull(operation!, opEntries) : opSection(operation!, opEntries)}
`

writeFileSync(outPath, report)
console.log(`Report written to ${outPath}`)
