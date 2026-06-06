/**
 * Generates a markdown report from batch evaluation benchmark results.
 *
 * Usage:
 *   node --import tsx benchmark/report-batch.ts <results.json> [--out <report.md>]
 *
 * Examples:
 *   node --import tsx benchmark/report-batch.ts benchmark/results-batch.json
 *   node --import tsx benchmark/report-batch.ts benchmark/results-batch.json --out benchmark/report-batch.md
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const outFlagIdx = args.indexOf('--out')
const outPath =
  outFlagIdx !== -1
    ? args[outFlagIdx + 1]
    : resolve(__dirname, 'report-batch.md')

const positional = args.filter(
  (_, i) =>
    i !== outFlagIdx && i !== outFlagIdx + 1 && !args[i].startsWith('--')
)

const [resultsPath] = positional

if (!resultsPath) {
  console.error(
    'Usage: node --import tsx benchmark/report-batch.ts <results.json> [--out <report.md>]'
  )
  process.exit(1)
}

interface LatencyStats {
  mean: number
  p50: number
  p75: number
  p99: number
  rme: number
  samplesCount: number
}

interface ThroughputStats {
  mean: number
}

interface TaskResult {
  state: string
  latency?: LatencyStats
  throughput?: ThroughputStats
}

interface TaskInfo {
  name: string
  result: TaskResult
}

interface AllResults {
  [taskName: string]: TaskResult
}

const results: AllResults = JSON.parse(readFileSync(resultsPath, 'utf-8'))

function formatMs(ms: number): string {
  if (ms >= 1) {
    return `${ms.toFixed(3)}ms`
  }
  return `${(ms * 1000).toFixed(1)}µs`
}

function formatHz(hz: number): string {
  if (hz >= 1_000_000) {
    return `${(hz / 1_000_000).toFixed(2)}M`
  }
  if (hz >= 1_000) {
    return `${(hz / 1_000).toFixed(2)}K`
  }
  return hz.toFixed(0)
}

// Group tasks by scenario
const scenarios: Map<string, TaskInfo[]> = new Map()

for (const [name, result] of Object.entries(results)) {
  const parts = name.split(' > ')
  const scenario = parts[0]

  if (!scenarios.has(scenario)) {
    scenarios.set(scenario, [])
  }
  scenarios.get(scenario)!.push({ name, result })
}

// Extract scenario metadata from task names
interface ScenarioData {
  name: string
  expressions: number
  keys: number
  complexity: string
  tasks: {
    name: string
    label: string
    latency?: LatencyStats
    throughput?: ThroughputStats
  }[]
}

function parseScenarioMetadata(scenarioName: string): {
  expressions: number
  keys: number
  complexity: string
} {
  switch (scenarioName) {
    case 'small':
      return { expressions: 10, keys: 5, complexity: 'simple' }
    case 'medium':
      return { expressions: 100, keys: 30, complexity: 'simple' }
    case 'large':
      return { expressions: 1000, keys: 100, complexity: 'simple' }
    case 'medium-complex':
      return { expressions: 100, keys: 20, complexity: 'complex' }
    case 'large-complex':
      return { expressions: 500, keys: 50, complexity: 'complex' }
    default:
      return { expressions: 0, keys: 0, complexity: 'unknown' }
  }
}

const scenarioData: ScenarioData[] = []

for (const [scenarioName, tasks] of scenarios) {
  const meta = parseScenarioMetadata(scenarioName)

  const taskData = tasks.map((t) => {
    const label = t.name.replace(`${scenarioName} > `, '')
    return {
      name: t.name,
      label,
      latency: t.result.latency,
      throughput: t.result.throughput,
    }
  })

  scenarioData.push({
    name: scenarioName,
    ...meta,
    tasks: taskData,
  })
}

function tableHeader(): string {
  return [
    '| Task | p50 | p75 | p99 | avg | ops/sec | margin |',
    '|------|-----|-----|-----|-----|---------|--------|',
  ].join('\n')
}

function tableRows(tasks: ScenarioData['tasks']): string {
  return tasks
    .map((t) => {
      if (!t.latency) {
        return (
          '| ' +
          [t.label, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'].join(' | ') +
          ' |'
        )
      }
      return (
        '| ' +
        [
          t.label,
          formatMs(t.latency.p50),
          formatMs(t.latency.p75),
          formatMs(t.latency.p99),
          formatMs(t.latency.mean),
          t.throughput ? `${formatHz(t.throughput.mean)} ops/s` : 'N/A',
          `±${t.latency.rme.toFixed(2)}%`,
        ].join(' | ') +
        ' |'
      )
    })
    .join('\n')
}

// Build the report
const lines: string[] = []

lines.push('# Batch Evaluation Benchmark Report')
lines.push('')
lines.push(`**Results file:** \`${resultsPath.split('/').pop()}\``)
lines.push('')
lines.push('---')
lines.push('')

// Summary section
lines.push('## Summary')
lines.push('')
lines.push('| Scenario | Expressions | Keys | Complexity |')
lines.push('|----------|-------------|------|------------|')
for (const sd of scenarioData) {
  lines.push(
    `| ${sd.name} | ${sd.expressions} | ${sd.keys} | ${sd.complexity} |`
  )
}
lines.push('')

// Detailed results
for (const sd of scenarioData) {
  lines.push(
    `## ${sd.name} (${sd.expressions} expressions, ${sd.keys} keys, ${sd.complexity} complexity)`
  )
  lines.push('')
  lines.push(tableHeader())
  lines.push(tableRows(sd.tasks))
  lines.push('')
}

// Incremental comparison section
lines.push('## Incremental Comparison')
lines.push('')
lines.push(
  'When 1 field changes, how long does it take to evaluate only the affected expressions?'
)
lines.push('')
lines.push(
  '| Scenario | Affected | Incremental Batch | Incremental Individual | Winner |'
)
lines.push(
  '|----------|----------|-------------------|------------------------|--------|'
)

// Known affected counts from benchmark runs (seed=42, random changed key)
const affectedCounts: Record<string, number> = {
  small: 6,
  medium: 8,
  large: 15,
  'medium-complex': 13,
  'large-complex': 22,
}

for (const sd of scenarioData) {
  const incBatch = sd.tasks.find((t) => t.label === 'incremental-batch')
  const incInd = sd.tasks.find((t) => t.label === 'incremental-individual')

  if (!incBatch?.latency || !incInd?.latency) {
    continue
  }

  const batchTime = incBatch.latency.mean
  const indTime = incInd.latency.mean
  const ratio = indTime / batchTime

  const affected = affectedCounts[sd.name] ?? '?'

  const winnerFormatted =
    ratio > 1.1
      ? `**batch ${ratio.toFixed(2)}x**`
      : ratio < 0.9
        ? `individual ${ratio.toFixed(2)}x`
        : 'tie'

  lines.push(
    `| ${sd.name} | ${affected} | ${formatMs(batchTime)} | ${formatMs(indTime)} | ${winnerFormatted} |`
  )
}

lines.push('')
lines.push('---')
lines.push('')
lines.push('## Key Findings')
lines.push('')
lines.push(
  '1. **Batch evaluation wins when many expressions are affected**' +
    ' — the shared compilation and dependency graph help amortize overhead.'
)
lines.push(
  '2. **Individual evaluation wins when few expressions change**' +
    ' — JIT-optimized bytecode is very efficient for small sets,' +
    ' and batch has overhead from dependency graph lookup + interpreter dispatch.'
)
lines.push(
  '3. **For the "1,000 fields, 1 field changes" scenario:**' +
    ' individual evaluation is significantly faster than batch' +
    ' for incremental updates.'
)
lines.push(
  '4. **Batch evaluation provides other advantages**' +
    ' — memory efficiency (shared refs/consts),' +
    ' predictable timing, and change detection via the dependency graph.'
)
lines.push('')
lines.push('---')
lines.push('')
lines.push('## Methodology')
lines.push('')
lines.push('- **Test generator:** Seeded PRNG (seed=42) for reproducibility')
lines.push('- **Expression types:** `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`')
lines.push(
  '- **Complex:** Some expressions wrapped in `AND` with nested conditions'
)
lines.push(
  '- **Changed key:** Randomly selected from context keys for incremental tests'
)
lines.push('- **Runtime:** Node.js v22 with V8 JIT')
lines.push(
  '- **Measurement:** tinybench with 50ms warmup, 50ms measurement per task'
)
lines.push('')

const report = lines.join('\n')
writeFileSync(outPath, report)
console.log(`Report written to ${outPath}`)
