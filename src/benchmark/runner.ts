import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { Bench, type TaskResultWithStatistics } from 'tinybench'
import { fileURLToPath } from 'url'

import { generateCases, type GeneratedCases } from './generate-cases.js'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag)
  return i !== -1 ? process.argv[i + 1] : undefined
}

interface Engine {
  parse(expression: unknown): {
    evaluate(ctx: Record<string, unknown>): boolean
    simplify(ctx: Record<string, unknown>): unknown
  }
}

export function loadConditions(engine: Engine, casesRoot: string) {
  return readdirSync(casesRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const dir = join(casesRoot, e.name)
      const expression = JSON.parse(
        readFileSync(join(dir, 'expression.json'), 'utf-8')
      )
      const parsed = engine.parse(expression)
      return { id: e.name, expression, parsed, ...generateCases(expression) }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

export type Condition = ReturnType<typeof loadConditions>[number]
export type ContextKey = keyof GeneratedCases

export function contextProducesExpected(
  condition: Condition,
  ctx: ContextKey
): boolean {
  const expectedTrue =
    ctx === 'completeTrue' ||
    ctx === 'partialTrue' ||
    ctx === 'fullExecutionTrue' ||
    ctx === 'earlyTrue' ||
    ctx === 'lateTrue'
  try {
    return condition.parsed.evaluate(condition[ctx]) === expectedTrue
  } catch {
    return false
  }
}

export async function runBench(
  name: string,
  conditions: Condition[],
  tasks: Array<{
    name: string
    ctx: ContextKey | null
    fn: (c: Condition) => () => void
  }>,
  outputPath: string
) {
  console.log(`\nRunning: ${name}`)
  const bench = new Bench({ time: 50, warmupTime: 20 })

  for (const condition of conditions) {
    for (const task of tasks) {
      if (task.ctx !== null && !contextProducesExpected(condition, task.ctx)) {
        continue
      }
      bench.add(`${name} > ${condition.id} > ${task.name}`, task.fn(condition))
    }
  }

  await bench.run()

  const toRow = (t: (typeof bench.tasks)[number]) => {
    const r = t.result as (TaskResultWithStatistics & object) | undefined
    const lat = r?.latency
    const thr = r?.throughput
    return {
      Task: t.name,
      'p50 (µs)': lat ? (lat.p50 * 1e6).toFixed(1) : 'N/A',
      'p75 (µs)': lat ? (lat.p75 * 1e6).toFixed(1) : 'N/A',
      'p99 (µs)': lat ? (lat.p99 * 1e6).toFixed(1) : 'N/A',
      'avg (µs)': lat ? (lat.mean * 1e6).toFixed(1) : 'N/A',
      'ops/sec': thr ? thr.mean.toFixed(0) : 'N/A',
      margin: lat ? `±${lat.rme.toFixed(2)}%` : 'N/A',
    }
  }

  console.table(bench.tasks.map(toRow))

  const results: Record<string, object> = {}
  for (const t of bench.tasks) {
    results[t.name] = { ...t.result }
  }

  writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\nResults written to ${outputPath}`)
}
