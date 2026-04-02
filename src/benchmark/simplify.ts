/**
 * Simplify benchmark runner.
 *
 * Usage:
 *   node --import tsx benchmark/simplify.ts [--cases <path>] [--out <file>] [--engine <path>]
 *
 * Examples:
 *   node --import tsx benchmark/simplify.ts
 *   node --import tsx benchmark/simplify.ts --cases conditions/synthetic-conditions
 *   node --import tsx benchmark/simplify.ts --cases conditions/sample-conditions --out benchmark/results-baseline.json
 *   node --import tsx benchmark/simplify.ts --engine /other/path/lib/illogical.esm.js
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

const { default: Engine } = await import(enginePath)
const engine = new Engine()

const conditions = loadConditions(engine, casesRoot)

const tasks: Array<{
  name: string
  ctx: ContextKey | null
  fn: (c: Condition) => () => void
}> = [
  {
    name: 'complete-true',
    ctx: 'completeTrue',
    fn: (c) => () => c.parsed.simplify(c.completeTrue),
  },
  {
    name: 'complete-false',
    ctx: 'completeFalse',
    fn: (c) => () => c.parsed.simplify(c.completeFalse),
  },
  {
    name: 'partial-true',
    ctx: 'partialTrue',
    fn: (c) => () => c.parsed.simplify(c.partialTrue),
  },
  {
    name: 'partial-false',
    ctx: 'partialFalse',
    fn: (c) => () => c.parsed.simplify(c.partialFalse),
  },
  {
    name: 'full-execution-true',
    ctx: 'fullExecutionTrue',
    fn: (c) => () => c.parsed.simplify(c.fullExecutionTrue),
  },
  {
    name: 'full-execution-false',
    ctx: 'fullExecutionFalse',
    fn: (c) => () => c.parsed.simplify(c.fullExecutionFalse),
  },
  { name: 'empty-context', ctx: null, fn: (c) => () => c.parsed.simplify({}) },
]

await runBench('simplify', conditions, tasks, outputPath)
