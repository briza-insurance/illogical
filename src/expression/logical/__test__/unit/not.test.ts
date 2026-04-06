import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Reference } from '../../../../operand/reference.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Not } from '../../not.js'

describe('Expression - Logical - Not', () => {
  describe('evaluate', () => {
    const evaluateData = [
      // Truthy
      [operand(false), true],
      // Falsy
      [operand(true), false],
    ] as [Evaluable, boolean][]
    for (const [operandValue, expected] of evaluateData) {
      test(`${operandValue} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Not(operandValue).evaluate({}), expected)
      })
    }

    const evaluateThrowData: Evaluable[][] = [
      [],
      [operand(true), operand(false)],
      [operand(0)],
    ]
    for (const operands of evaluateThrowData) {
      test(`${operands} should throw`, () => {
        assert.throws(() => new Not(...operands).evaluate({}))
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Not, Evaluable | boolean][] = [
      [new Not(notSimplified()), new Not(notSimplified())],
      [new Not(operand(false)), true],
      [new Not(operand(true)), false],
    ]
    for (const [and, expected] of simplifyData) {
      it(`${and} should simplify to ${expected}`, () => {
        assert.deepStrictEqual(and.simplify({}, new Set([])), expected)
      })
    }
  })

  describe('serialize', () => {
    const serializeData: [Operand, [Input]][] = [
      [new Reference('test'), ['$test']],
      [new Value(10), [10]],
    ]
    for (const [operands, expected] of serializeData) {
      it(`${operands} should serialize to ${expected}`, () => {
        assert.deepStrictEqual(new Not(operands).serialize(defaultOptions), [
          'NOT',
          ...expected,
        ])
      })
    }
  })
})
