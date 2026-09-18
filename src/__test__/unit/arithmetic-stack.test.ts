import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import Engine, { type Context, type ExpressionInput } from '../../index.js'

interface Case {
  description: string
  expression: ExpressionInput
  context: Context
  expected: boolean
}

const CASES: Case[] = [
  {
    description:
      'reported: ==(missing-ref sum, concrete), (missing middle-ref sum) with {}',
    expression: ['==', ['+', '$A', 0], ['+', 0, '$0', 0]],
    context: {},
    expected: true, // false == false
  },
  {
    description: '3-operand sums with missing refs on both sides',
    expression: ['==', ['+', 1, '$A', 2], ['+', 1, 2, '$B']],
    context: {},
    expected: true, // false == false
  },
  {
    description:
      '3-operand sum missing ref vs a concrete sum (false == number)',
    expression: ['==', ['+', '$A', 1, 2], ['+', 1, 2, 3]],
    context: {},
    expected: false, // false == 6
  },
  {
    description: '3-operand subtract with a missing ref on both sides',
    expression: ['==', ['-', 10, '$A'], ['-', '$B', 1, 2]],
    context: {},
    expected: true, // false == false
  },
  {
    description: '4-operand multiply with a missing ref on both sides',
    expression: ['==', ['*', 1, 2, '$A'], ['*', '$B', 3, 4, 5]],
    context: {},
    expected: true, // false == false
  },
  {
    description: '4-operand sum present matches a concrete 2-operand sum',
    expression: ['==', ['+', 1, 2, 3, 4], ['+', 3, 7]],
    context: {},
    expected: true, // 10 == 10
  },
  {
    description: '3-operand sum present with an actual context value',
    expression: ['==', ['+', '$X', 1, 2], 10],
    context: { X: 7 },
    expected: true, // 10 == 10
  },
]

const engine = new Engine()

for (const tc of CASES) {
  test(`${tc.description}`, () => {
    assert.strictEqual(
      engine.evaluate(tc.expression, tc.context),
      tc.expected,
      `Expected ${tc.expected}, got ${engine.evaluate(tc.expression, tc.context)}`
    )
  })
}
