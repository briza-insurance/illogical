/**
 * Batch evaluator benchmark runner.
 *
 * Compares:
 * 1. Cold individual — compile + evaluate all expressions from scratch
 * 2. Warm individual — evaluate all expressions (already compiled)
 * 3. Cold batch — compile + evaluate all expressions as a batch
 * 4. Warm batch — evaluate all expressions (already compiled)
 * 5. Incremental batch — evaluate only affected expressions (batch)
 * 6. Incremental individual — evaluate only affected expressions (one-by-one)
 *
 * Usage:
 *   node --import tsx src/benchmark/batch-evaluate.ts [--out benchmark/results-batch.json]
 *
 * Examples:
 *   node --import tsx src/benchmark/batch-evaluate.ts
 *   node --import tsx src/benchmark/batch-evaluate.ts --out benchmark/results-batch-large.json
 */

import { writeFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { Bench } from 'tinybench'
import { fileURLToPath } from 'url'

import { compileBatch } from '../batch/compiler.js'
import { findAffectedExpressions } from '../batch/dependency-graph.js'
import { interpretBatch } from '../batch/interpreter.js'
import {
  compile as compileSingle,
  type CompiledExpression,
} from '../bytecode/compiler.js'
import { interpret as interpretSingle } from '../bytecode/interpreter.js'
import { Result } from '../common/evaluable.js'
import type { Context, ExpressionInput } from '../index.js'
import { defaultOptions, type Options } from '../parser/options.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Test case definitions
// ---------------------------------------------------------------------------

interface TestCase {
  name: string
  numExpressions: number
  numContextKeys: number
  /** Fraction of keys shared between expressions (0.0 to 1.0) */
  keyOverlap: number
  /** Complexity level: 'simple' (single ops) or 'complex' (nested AND/OR) */
  complexity?: 'simple' | 'complex'
}

const testCases: TestCase[] = [
  { name: 'small', numExpressions: 10, numContextKeys: 5, keyOverlap: 0.3 },
  { name: 'medium', numExpressions: 100, numContextKeys: 30, keyOverlap: 0.5 },
  { name: 'large', numExpressions: 1000, numContextKeys: 100, keyOverlap: 0.4 },
  {
    name: 'medium-complex',
    numExpressions: 100,
    numContextKeys: 20,
    keyOverlap: 0.5,
    complexity: 'complex',
  },
  {
    name: 'large-complex',
    numExpressions: 500,
    numContextKeys: 50,
    keyOverlap: 0.4,
    complexity: 'complex',
  },
]

// ---------------------------------------------------------------------------
// Seeded PRNG for reproducible test case generation
// ---------------------------------------------------------------------------

class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647
    return (this.seed - 1) / 2147483646
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max)
  }

  nextFloat(): number {
    return this.next()
  }
}

// ---------------------------------------------------------------------------
// Random expression generation
// ---------------------------------------------------------------------------

/**
 * Generate a random expression using the given context keys.
 */
function generateRandomExpression(
  rng: SeededRandom,
  contextKeys: string[],
  complexity: 'simple' | 'complex' = 'simple'
): ExpressionInput {
  const simpleOps = ['==', '!=', '>', '>=', '<', '<=', 'in']
  const op = simpleOps[rng.nextInt(simpleOps.length)]

  if (op === 'in') {
    const key = contextKeys[rng.nextInt(contextKeys.length)]
    const constVals = [1, 2, 3, 4, 5]
    return [
      op,
      `$${key}`,
      constVals.map(() => rng.nextInt(5) + 1),
    ] as ExpressionInput
  }

  const key1 = contextKeys[rng.nextInt(contextKeys.length)]
  const key2 = contextKeys[rng.nextInt(contextKeys.length)]

  if (complexity === 'complex' && rng.nextFloat() > 0.5) {
    // Wrap in AND with another condition
    const innerOp = simpleOps[rng.nextInt(simpleOps.length)]
    const innerKey = contextKeys[rng.nextInt(contextKeys.length)]
    const innerVal =
      innerOp === 'in'
        ? [1, 2, 3].map(() => rng.nextInt(5) + 1)
        : contextKeys[rng.nextInt(contextKeys.length)]
    const inner: ExpressionInput =
      innerOp === 'in'
        ? [innerOp, `$${innerKey}`, innerVal]
        : ([innerOp, `$${innerKey}`, innerVal] as ExpressionInput)
    return ['AND', inner, [op, `$${key1}`, `$${key2}`]] as ExpressionInput
  }

  return [op, `$${key1}`, `$${key2}`] as ExpressionInput
}

/**
 * Generate a full test case with expressions and context.
 */
function generateTestCase(
  tc: TestCase,
  seed: number
): {
  expressions: Map<string, ExpressionInput>
  context: Context
  contextKeys: string[]
} {
  const rng = new SeededRandom(seed)
  const complexity = tc.complexity ?? 'simple'
  const contextKeys: string[] = []

  for (let i = 0; i < tc.numContextKeys; i++) {
    contextKeys.push(`key${i}`)
  }

  const expressions = new Map<string, ExpressionInput>()
  for (let i = 0; i < tc.numExpressions; i++) {
    const name = `expr${i}`
    const expr = generateRandomExpression(rng, contextKeys, complexity)
    expressions.set(name, expr)
  }

  // Generate context values
  const context: Context = {}
  for (const key of contextKeys) {
    context[key] = rng.nextFloat() > 0.5 ? 1 : 0
  }

  return { expressions, context, contextKeys }
}

// ---------------------------------------------------------------------------
// Evaluation helpers
// ---------------------------------------------------------------------------

/**
 * Evaluate expressions individually using the single-expression compiler.
 * Each expression is compiled and evaluated separately (no sharing).
 * Creates a fresh compiler each time to ensure fair comparison with batch.
 */
function evaluateIndividual(
  expressions: Map<string, ExpressionInput>,
  context: Context,
  opts: Options
): Record<string, Result> {
  const results: Record<string, Result> = {}
  for (const [name, raw] of expressions) {
    const compiled = compileSingle(raw, opts)
    const result = interpretSingle(compiled, context)
    results[name] = result
  }
  return results
}

/**
 * Evaluate only a subset of expressions in a pre-compiled batch (incremental).
 * Only expressions affected by changedKeys are re-evaluated.
 */
function evaluateBatchIncrementalWarm(
  batch: ReturnType<typeof compileBatch>,
  context: Context,
  changedKeys: string[]
): Record<string, Result> {
  const affected = findAffectedExpressions(batch.dependencyGraph, changedKeys)

  if (affected.size === 0) {
    return {}
  }

  return interpretBatch(batch, context, affected)
}

/**
 * Evaluate a subset of pre-compiled expressions individually.
 * Each expression is already compiled — no compilation overhead.
 */
function evaluateIndividualSubsetWarm(
  compiled: Array<{ name: string; bytecode: CompiledExpression }>,
  context: Context,
  exprNames: Set<string>
): Record<string, Result> {
  const results: Record<string, Result> = {}
  for (const { name, bytecode } of compiled) {
    if (!exprNames.has(name)) {
      continue
    }
    results[name] = interpretSingle(bytecode, context)
  }
  return results
}

/**
 * Evaluate expressions as a batch.
 * Compiles once, shares resources across all expressions.
 */
function evaluateBatch(
  expressions: Map<string, ExpressionInput>,
  context: Context,
  opts: Options
): Record<string, Result> {
  const batch = compileBatch(expressions, opts)
  return interpretBatch(batch, context)
}

/**
 * Evaluate expressions as a batch using a pre-compiled batch.
 * No compilation overhead — only interpretation.
 */
function evaluateBatchWarm(
  batch: ReturnType<typeof compileBatch>,
  context: Context
): Record<string, Result> {
  return interpretBatch(batch, context)
}

// ---------------------------------------------------------------------------
// Benchmark runner
// ---------------------------------------------------------------------------

async function runBenchmarks() {
  const outputPath = resolve(
    process.argv.includes('--out')
      ? process.argv[process.argv.indexOf('--out') + 1]
      : join(__dirname, '../../benchmark/results-batch.json')
  )

  const allResults: Record<string, object> = {}

  for (const tc of testCases) {
    console.log(
      `\nRunning benchmark: ${tc.name} (` +
        `${tc.numExpressions} expressions, ` +
        `${tc.numContextKeys} keys, ` +
        `${tc.complexity ?? 'simple'} complexity)`
    )

    const { expressions, context, contextKeys } = generateTestCase(tc, 42)

    // Pick a random key to change for incremental benchmark
    const changedKey =
      contextKeys[Math.floor(Math.random() * contextKeys.length)]

    // Pre-compile batch for warm benchmarks
    const warmBatch = compileBatch(expressions, defaultOptions)

    // Pre-compile individual expressions for warm benchmarks
    const compiledIndividual: Array<{
      name: string
      bytecode: CompiledExpression
    }> = []
    for (const [name, raw] of expressions) {
      compiledIndividual.push({
        name,
        bytecode: compileSingle(raw, defaultOptions),
      })
    }

    // Find affected expressions (same for both batch and individual)
    const affectedExpressions = findAffectedExpressions(
      warmBatch.dependencyGraph,
      [changedKey]
    )

    // --- 1. Cold individual: compile + evaluate all ---
    const benchColdInd = new Bench({ time: 50, warmupTime: 20 })
    benchColdInd.add(`${tc.name} > cold-individual`, () =>
      evaluateIndividual(expressions, context, defaultOptions)
    )
    await benchColdInd.run()

    // --- 2. Warm individual: evaluate all (pre-compiled) ---
    // We simulate this by compiling once outside, then evaluating in loop
    const compiledForWarm: Array<{
      name: string
      bytecode: CompiledExpression
    }> = []
    for (const [name, raw] of expressions) {
      compiledForWarm.push({
        name,
        bytecode: compileSingle(raw, defaultOptions),
      })
    }
    const benchWarmInd = new Bench({ time: 50, warmupTime: 20 })
    benchWarmInd.add(`${tc.name} > warm-individual`, () => {
      const results: Record<string, Result> = {}
      for (const { name, bytecode } of compiledForWarm) {
        results[name] = interpretSingle(bytecode, context)
      }
      return results
    })
    await benchWarmInd.run()

    // --- 3. Cold batch: compile + evaluate all ---
    const benchColdBatch = new Bench({ time: 50, warmupTime: 20 })
    benchColdBatch.add(`${tc.name} > cold-batch`, () =>
      evaluateBatch(expressions, context, defaultOptions)
    )
    await benchColdBatch.run()

    // --- 4. Warm batch: evaluate all (pre-compiled) ---
    const benchWarmBatch = new Bench({ time: 50, warmupTime: 20 })
    benchWarmBatch.add(`${tc.name} > warm-batch`, () =>
      evaluateBatchWarm(warmBatch, context)
    )
    await benchWarmBatch.run()

    // --- 5. Incremental batch (warm): evaluate affected only, no compilation ---
    const benchIncBatch = new Bench({ time: 50, warmupTime: 20 })
    benchIncBatch.add(`${tc.name} > incremental-batch`, () =>
      evaluateBatchIncrementalWarm(warmBatch, context, [changedKey])
    )
    await benchIncBatch.run()

    // --- 6. Incremental individual (warm): evaluate affected only, no compilation ---
    const benchIncInd = new Bench({ time: 50, warmupTime: 20 })
    benchIncInd.add(`${tc.name} > incremental-individual`, () =>
      evaluateIndividualSubsetWarm(
        compiledIndividual,
        context,
        affectedExpressions
      )
    )
    await benchIncInd.run()

    // Collect results
    const toRow = (t: (typeof benchColdInd.tasks)[number]) => {
      const r = t.result
      const stats = 'latency' in r ? r.latency : undefined
      const thr = 'throughput' in r ? r.throughput : undefined
      return {
        Task: t.name,
        'p50 (µs)': stats ? (stats.p50 * 1e6).toFixed(1) : 'N/A',
        'p75 (µs)': stats ? (stats.p75 * 1e6).toFixed(1) : 'N/A',
        'p99 (µs)': stats ? (stats.p99 * 1e6).toFixed(1) : 'N/A',
        'avg (µs)': stats ? (stats.mean * 1e6).toFixed(1) : 'N/A',
        'ops/sec': thr ? thr.mean.toFixed(0) : 'N/A',
        margin: stats ? `±${stats.rme.toFixed(2)}%` : 'N/A',
      }
    }

    console.table(benchColdInd.tasks.map(toRow))
    console.table(benchWarmInd.tasks.map(toRow))
    console.table(benchColdBatch.tasks.map(toRow))
    console.table(benchWarmBatch.tasks.map(toRow))
    console.table(benchIncBatch.tasks.map(toRow))
    console.table(benchIncInd.tasks.map(toRow))

    for (const t of [
      ...benchColdInd.tasks,
      ...benchWarmInd.tasks,
      ...benchColdBatch.tasks,
      ...benchWarmBatch.tasks,
      ...benchIncBatch.tasks,
      ...benchIncInd.tasks,
    ]) {
      allResults[t.name] = { ...t.result }
    }

    // Print summary comparison
    const incBatchResult = benchIncBatch.tasks[0].result
    const incIndResult = benchIncInd.tasks[0].result
    if (
      'latency' in incBatchResult &&
      'latency' in incIndResult &&
      incBatchResult.latency &&
      incIndResult.latency
    ) {
      const batchTime = incBatchResult.latency.mean
      const indTime = incIndResult.latency.mean
      const affectedCount = affectedExpressions.size
      console.log(
        `\n  Summary: ${tc.name} — ${affectedCount} of ${tc.numExpressions} expressions affected`
      )
      console.log(`  Incremental batch: ${batchTime.toFixed(3)}ms`)
      console.log(`  Incremental individual: ${indTime.toFixed(3)}ms`)
      if (indTime > 0) {
        console.log(`  Speedup: ${(indTime / batchTime).toFixed(2)}x`)
      }
    }
  }

  writeFileSync(outputPath, JSON.stringify(allResults, null, 2))
  console.log(`\nResults written to ${outputPath}`)
}

runBenchmarks().catch((err) => {
  console.error('Benchmark failed:', err)
  process.exit(1)
})
