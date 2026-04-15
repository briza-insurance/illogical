/**
 * Evaluate benchmark runner.
 *
 * Usage:
 *   node --import tsx benchmark/evaluate.ts [--cases <path>] [--out <file>] [--engine <path>] [--options <json>]
 *
 * Examples:
 *   node --import tsx benchmark/evaluate.ts
 *   node --import tsx benchmark/evaluate.ts --cases conditions/synthetic-conditions
 *   node --import tsx benchmark/evaluate.ts --cases conditions/sample-conditions --out benchmark/results-baseline.json
 *   node --import tsx benchmark/evaluate.ts --engine /other/path/lib/illogical.esm.js
 *   node --import tsx benchmark/evaluate.ts --options '{"evaluator":"bytecode"}'
 */

import { join, resolve } from 'path'

import {
  __dirname,
  type Condition,
  type ContextKey,
  getArg,
  loadConditions,
  runBench,
} from './runner.js'

const casesRoot = resolve(
  getArg('--cases') ?? join(__dirname, '../conditions/sample-conditions')
)
const outputPath = resolve(getArg('--out') ?? join(__dirname, 'results.json'))
const enginePath = resolve(
  getArg('--engine') ?? join(__dirname, '../../lib/illogical.esm.js')
)

const engineOptions = getArg('--options')

const { default: Engine } = await import(enginePath)
const engine = new Engine(engineOptions ? JSON.parse(engineOptions) : undefined)

const conditions = loadConditions(engine, casesRoot)

const tasks: Array<{
  name: string
  ctx: ContextKey | null
  fn: (c: Condition) => () => void
}> = [
  {
    name: 'complete-true',
    ctx: 'completeTrue',
    fn: (c) => () => c.parsed.evaluate(c.completeTrue),
  },
  {
    name: 'complete-false',
    ctx: 'completeFalse',
    fn: (c) => () => c.parsed.evaluate(c.completeFalse),
  },
  {
    name: 'partial-true',
    ctx: 'partialTrue',
    fn: (c) => () => c.parsed.evaluate(c.partialTrue),
  },
  {
    name: 'partial-false',
    ctx: 'partialFalse',
    fn: (c) => () => c.parsed.evaluate(c.partialFalse),
  },
  {
    name: 'full-execution-true',
    ctx: 'fullExecutionTrue',
    fn: (c) => () => c.parsed.evaluate(c.fullExecutionTrue),
  },
  {
    name: 'full-execution-false',
    ctx: 'fullExecutionFalse',
    fn: (c) => () => c.parsed.evaluate(c.fullExecutionFalse),
  },
  {
    name: 'early-true',
    ctx: 'earlyTrue',
    fn: (c) => () => c.parsed.evaluate(c.earlyTrue),
  },
  {
    name: 'late-true',
    ctx: 'lateTrue',
    fn: (c) => () => c.parsed.evaluate(c.lateTrue),
  },
  { name: 'empty-context', ctx: null, fn: (c) => () => c.parsed.evaluate({}) },
]

await runBench('evaluate', conditions, tasks, outputPath)
