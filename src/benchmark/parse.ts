/**
 * Parse benchmark runner.
 *
 * Usage:
 *   node --import tsx benchmark/parse.ts [--cases <path>] [--out <file>] [--engine <path>] [--options <json>]
 *
 * Examples:
 *   node --import tsx benchmark/parse.ts
 *   node --import tsx benchmark/parse.ts --cases conditions/synthetic-conditions
 *   node --import tsx benchmark/parse.ts --cases conditions/sample-conditions --out benchmark/results-baseline.json
 *   node --import tsx benchmark/parse.ts --engine /other/path/lib/illogical.esm.js
 *   node --import tsx benchmark/parse.ts --options '{"evaluator":"bytecode"}'
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
const filterArg = getArg('--filter')

const engineOptions = getArg('--options')

const { default: Engine } = await import(enginePath)
const engine = new Engine(engineOptions ? JSON.parse(engineOptions) : undefined)

const conditions = loadConditions(engine, casesRoot, filterArg)

const tasks: Array<{
  name: string
  ctx: ContextKey | null
  fn: (c: Condition) => () => void
}> = [
  {
    name: 'complete-true',
    ctx: 'completeTrue',
    fn: (c) => () => engine.parse(c.expression),
  },
  {
    name: 'complete-false',
    ctx: 'completeFalse',
    fn: (c) => () => engine.parse(c.expression),
  },
  {
    name: 'partial-true',
    ctx: 'partialTrue',
    fn: (c) => () => engine.parse(c.expression),
  },
  {
    name: 'partial-false',
    ctx: 'partialFalse',
    fn: (c) => () => engine.parse(c.expression),
  },
  {
    name: 'full-execution-true',
    ctx: 'fullExecutionTrue',
    fn: (c) => () => engine.parse(c.expression),
  },
  {
    name: 'full-execution-false',
    ctx: 'fullExecutionFalse',
    fn: (c) => () => engine.parse(c.expression),
  },
  {
    name: 'empty-context',
    ctx: null,
    fn: (c) => () => engine.parse(c.expression),
  },
]

await runBench('parse', conditions, tasks, outputPath)
