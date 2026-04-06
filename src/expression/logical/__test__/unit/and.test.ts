import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Reference } from '../../../../operand/reference.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { And } from '../../and.js'

describe('Expression - Logical - And', () => {
  describe('evaluate', () => {
    const evaluateData = [
      // Truthy
      [[operand(true), operand(true)], true],
      // Falsy
      [[operand(true), operand(false)], false],
      [[operand(false), operand(true)], false],
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][]
    for (const [operands, expected] of evaluateData) {
      test(`${operands} should evaluate as ${expected}`, () => {
        assert.strictEqual(new And(operands).evaluate({}), expected)
      })
    }

    const evaluateThrowData: Evaluable[][] = [[]]
    for (const operands of evaluateThrowData) {
      test(`${operands} should throw`, () => {
        assert.throws(() => new And(operands).evaluate({}))
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [And, Evaluable | boolean][] = [
      [new And([notSimplified(), operand(true)]), notSimplified()],
      [new And([notSimplified(), operand(false), notSimplified()]), false],
      [new And([operand(true), operand(true)]), true],
      [
        new And([notSimplified(), operand(true), notSimplified()]),
        new And([notSimplified(), notSimplified()]),
      ],
      [
        new And([operand(true), new And([operand(true), notSimplified()])]),
        notSimplified(),
      ],
    ]
    for (const [and, expected] of simplifyData) {
      it(`${and} should simplify to ${expected}`, () => {
        assert.deepStrictEqual(and.simplify({}, new Set([])), expected)
      })
    }
  })

  describe('serialize', () => {
    const serializeData: [[Operand, Operand], [Input, Input]][] = [
      [
        [new Value(10), new Reference('test')],
        [10, '$test'],
      ],
    ]
    for (const [operands, expected] of serializeData) {
      it(`${operands} should serialize to ${expected}`, () => {
        assert.deepStrictEqual(new And(operands).serialize(defaultOptions), [
          'AND',
          ...expected,
        ])
      })
    }
  })
})
