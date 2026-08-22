import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import Engine, { type Context, type ExpressionInput } from '../../index.js'

/**
 * Regression tests for a bytecode OOP evaluation mismatch on multi-operand
 * (3+) arithmetic expressions containing missing references.
 *
 * Reported case:
 *   evaluate ["==",["+","$A",0],["+",0,"$0",0]] with {}
 *     OOP          -> true
 *     bytecode     -> false   (mismatch)
 *
 * The documented behavior is that arithmetic ignores non-present operands for
 * the calculation but returns false if any reference is missing. Both operands
 * here evaluate to false, so `false == false` is true.
 *
 * Every case must evaluate identically under both the `oop` and `bytecode`
 * evaluators.
 */

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

const oop = new Engine({ evaluator: 'oop' })
const bytecode = new Engine({ evaluator: 'bytecode' })

for (const tc of CASES) {
  test(`oop: ${tc.description}`, () => {
    assert.strictEqual(
      oop.evaluate(tc.expression, tc.context),
      tc.expected,
      `Expected ${tc.expected}, got ${oop.evaluate(tc.expression, tc.context)}`
    )
  })

  test(`bytecode: ${tc.description}`, () => {
    assert.strictEqual(
      bytecode.evaluate(tc.expression, tc.context),
      tc.expected,
      `Expected ${tc.expected}, got ${bytecode.evaluate(tc.expression, tc.context)}`
    )
  })

  test(`agreement: ${tc.description}`, () => {
    const a = oop.evaluate(tc.expression, tc.context)
    const b = bytecode.evaluate(tc.expression, tc.context)
    assert.strictEqual(
      a,
      b,
      `Evaluators disagree on ${JSON.stringify(tc.expression)} with ${JSON.stringify(
        tc.context
      )}: oop=${a}, bytecode=${b}`
    )
  })
}
