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

  test(`Benchmark ${mode} evaluator`, () => {
    const engine = new Engine({ evaluator: mode })
    const start = performance.now()

    for (const tc of testCases) {
      engine.simplify(tc.expression, tc.context, tc.strictKeys, tc.optionalKeys)
    }

    const totalDuration = performance.now() - start
    console.log(
      `[${mode}] (Engine.simplify) Total: ${totalDuration.toFixed(2)}ms |` +
        ` Avg: ${(totalDuration / testCases.length).toFixed(2)}ms (${testCases.length} conditions)`
    )
  })
})
