import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { describe, test } from 'node:test'

import Engine, {
  type Context,
  type ExpressionInput,
  type Input,
} from '../../index.js'

const SIMPLIFY_CONDITIONS_DIR = resolve('conditions/simplify-conditions')

interface TestCase {
  description: string
  expression: ExpressionInput
  context: Context
  expected: Input | boolean
  strictKeys?: string[]
  optionalKeys?: string[]
}

const testFiles = readdirSync(SIMPLIFY_CONDITIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
  .map((entry) => join(SIMPLIFY_CONDITIONS_DIR, entry.name))
  .sort()

const testCases: TestCase[] = testFiles.map((filePath) =>
  JSON.parse(readFileSync(filePath, 'utf8'))
)

describe('Simplify performance - bytecode', () => {
  const mode = 'bytecode'

  test(`Benchmark ${mode} evaluator (with cache)`, () => {
    const engine = new Engine({ evaluator: mode })

    const pass1Start = performance.now()
    const cached = testCases.map((tc) => {
      const evaluable = engine.parse(tc.expression)
      evaluable.simplify(tc.context, tc.strictKeys, tc.optionalKeys)
      return { evaluable, tc }
    })
    const pass1Duration = performance.now() - pass1Start

    const pass2Start = performance.now()
    for (const { evaluable, tc } of cached) {
      evaluable.simplify(tc.context, tc.strictKeys, tc.optionalKeys)
    }

    const pass2TotalDuration = performance.now() - pass2Start

    console.log(
      `[${mode}] (Evaluable.simplify) Pass 1 (initial parse + simplify):` +
        `\n\tTotal: ${pass1Duration.toFixed(2)}ms |` +
        ` Avg: ${(pass1Duration / testCases.length).toFixed(2)}ms` +
        `\n[${mode}] Pass 2 (cached parse + simplify)` +
        `\n\tTotal: ${pass2TotalDuration.toFixed(2)}ms |` +
        ` Avg: ${(pass2TotalDuration / testCases.length).toFixed(2)}ms`
    )
  })
})
