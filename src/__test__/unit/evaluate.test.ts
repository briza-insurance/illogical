import { strict as assert } from 'node:assert'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, test } from 'node:test'

import Engine, { type Context, type ExpressionInput } from '../../index.js'

const EVALUATE_CONDITIONS_DIR = resolve('conditions/evaluate-conditions')

interface TestCase {
  description: string
  expression: ExpressionInput
  context: Context
  expected: boolean
}

function loadTestCase(filePath: string): TestCase {
  const raw: TestCase = JSON.parse(readFileSync(filePath, 'utf8'))
  assert.ok(raw.description, `Test case at ${filePath} must have a description`)
  assert.ok(
    Array.isArray(raw.expression),
    `Test case at ${filePath} must have an expression array`
  )
  assert.ok(
    raw.context != null,
    `Test case at ${filePath} must have a context object`
  )
  assert.ok(
    typeof raw.expected === 'boolean',
    `Test case at ${filePath} must have a boolean expected value`
  )
  return raw
}

// Load all test cases
const testFiles = readdirSync(EVALUATE_CONDITIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
  .map((entry) => join(EVALUATE_CONDITIONS_DIR, entry.name))
  .sort()

const testCases: TestCase[] = testFiles.map(loadTestCase)

// Run all test cases against both evaluators
for (const mode of ['oop', 'bytecode'] as const) {
  describe(`Evaluate — ${mode} evaluator`, () => {
    const engine = new Engine({ evaluator: mode })

    for (const tc of testCases) {
      test(tc.description, () => {
        const result = engine.evaluate(tc.expression, tc.context)
        assert.strictEqual(
          result,
          tc.expected,
          `Expected evaluate to return ${tc.expected}, got ${result}`
        )
      })
    }
  })
}
