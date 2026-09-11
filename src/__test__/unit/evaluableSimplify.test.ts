import { strict as assert } from 'node:assert'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, test } from 'node:test'

import Engine, {
  type Context,
  defaultOptions,
  type ExpressionInput,
  type Input,
  isEvaluable,
} from '../../index.js'

const SIMPLIFY_CONDITIONS_DIR = resolve('conditions/simplify-conditions')

function isInput(value: unknown): value is Input {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    (typeof value[0] === 'string' ||
      typeof value[0] === 'number' ||
      typeof value[0] === 'boolean')
  )
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

interface TestCase {
  description: string
  expression: ExpressionInput
  context: Context
  expected: Input | boolean
  strictKeys?: string[]
  optionalKeys?: string[]
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
    isInput(raw.expected) || isBoolean(raw.expected),
    `Test case at ${filePath} must have an expected Input or boolean`
  )
  return raw
}

// Load all test cases
const testFiles = readdirSync(SIMPLIFY_CONDITIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
  .map((entry) => join(SIMPLIFY_CONDITIONS_DIR, entry.name))
  .sort()

const testCases: TestCase[] = testFiles.map(loadTestCase)

// Run all test cases against both evaluators
for (const mode of ['oop', 'bytecode'] as const) {
  describe(`Simplify — ${mode} evaluator`, () => {
    const engine = new Engine({ evaluator: mode })

    for (const tc of testCases) {
      test(tc.description, () => {
        const parsed = engine.parse(tc.expression)
        const parsedResult = parsed.simplify(
          tc.context,
          tc.strictKeys,
          tc.optionalKeys
        )
        const result = engine.simplify(
          tc.expression,
          tc.context,
          tc.strictKeys,
          tc.optionalKeys
        )
        assert.deepStrictEqual(
          isEvaluable(parsedResult)
            ? parsedResult.serialize(defaultOptions)
            : parsedResult,
          isEvaluable(result) ? result.serialize(defaultOptions) : result,
          `[${mode}] Engine simplify should match Evaluable simplify`
        )
        assert.deepStrictEqual(
          result,
          tc.expected,
          `[${mode}] Expected simplify to return ${JSON.stringify(tc.expected)}, got ${JSON.stringify(result)}`
        )
      })
    }
  })
}
