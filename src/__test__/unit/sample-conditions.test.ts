import { strict as assert } from 'node:assert'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, test } from 'node:test'

import { generateCases } from '../../benchmark/generate-cases.js'
import Engine, { type Context, type ExpressionInput } from '../../index.js'

function isExpressionInput(value: unknown): value is ExpressionInput {
  return (
    Array.isArray(value) && value.length > 0 && typeof value[0] === 'string'
  )
}

const SAMPLE_CONDITIONS_DIR = resolve('conditions/sample-conditions')

const engine = new Engine()

const sampleDirs = readdirSync(SAMPLE_CONDITIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

for (const conditionDir of sampleDirs) {
  const dir = join(SAMPLE_CONDITIONS_DIR, conditionDir)

  const raw: unknown = JSON.parse(
    readFileSync(join(dir, 'expression.json'), 'utf8')
  )
  if (!isExpressionInput(raw)) {
    continue
  }
  const expression = raw

  const generated = generateCases(expression)

  const namedSamples: Array<{
    name: string
    context: Context
    expected: boolean
  }> = [
    { name: 'complete-true', context: generated.completeTrue, expected: true },
    {
      name: 'complete-false',
      context: generated.completeFalse,
      expected: false,
    },
    { name: 'partial-true', context: generated.partialTrue, expected: true },
    { name: 'partial-false', context: generated.partialFalse, expected: false },
    {
      name: 'full-execution-true',
      context: generated.fullExecutionTrue,
      expected: true,
    },
    {
      name: 'full-execution-false',
      context: generated.fullExecutionFalse,
      expected: false,
    },
  ]

  describe(`Sample condition: ${conditionDir}`, () => {
    for (const { name, context, expected } of namedSamples) {
      test(`${name} evaluates to ${expected}`, () => {
        assert.strictEqual(
          engine.evaluate(expression, context),
          expected,
          `Expected ${name} context to evaluate to ${expected}`
        )
      })
    }
  })
}
