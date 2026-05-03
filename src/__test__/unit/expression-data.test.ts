import { strict as assert } from 'node:assert'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, test } from 'node:test'

import Engine, { type Context, type ExpressionInput } from '../../index.js'

interface TestCase {
  expression: ExpressionInput
  context: Context
  expected: boolean
}

const DATA_DIR = resolve('src/__test__/data')

for (const evaluator of ['oop', 'bytecode'] as const) {
  const engine = new Engine({ evaluator })

  for (const entry of readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      continue
    }
    const file = join(DATA_DIR, entry.name)
    const cases: TestCase[] = JSON.parse(readFileSync(file, 'utf8'))
    describe(`[${evaluator}] ${entry.name}`, () => {
      for (const { expression, context, expected } of cases) {
        test(`${JSON.stringify(expression)} in ${JSON.stringify(context)} → ${expected}`, () => {
          assert.strictEqual(engine.evaluate(expression, context), expected)
        })
      }
    })
  }
}
