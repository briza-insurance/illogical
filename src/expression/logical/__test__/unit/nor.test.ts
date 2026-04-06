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
import { Nor } from '../../nor.js'
import { Not } from '../../not.js'

describe('Expression - Logical - Nor', () => {
  describe('evaluate', () => {
    const evaluateData = [
      // Truthy
      [[operand(false), operand(false)], true],
      // Falsy
      [[operand(true), operand(false)], false],
      [[operand(false), operand(true)], false],
      [[operand(true), operand(true)], false],
    ] as [Evaluable[], boolean][]
    for (const [operands, expected] of evaluateData) {
      test(`${operands} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Nor(operands).evaluate({}), expected)
      })
    }

    const evaluateThrowData: Evaluable[][] = [[]]
    for (const operands of evaluateThrowData) {
      test(`${operands} should throw`, () => {
        assert.throws(() => new Nor(operands).evaluate({}))
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Nor, Evaluable | boolean][] = [
      [new Nor([notSimplified(), operand(false)]), new Not(notSimplified())],
      [new Nor([notSimplified(), operand(true), notSimplified()]), false],
      [new Nor([operand(false), operand(false)]), true],
      [
        new Nor([notSimplified(), operand(false), notSimplified()]),
        new Nor([notSimplified(), notSimplified()]),
      ],
      [
        new Nor([operand(false), new Nor([operand(false), notSimplified()])]),
        new Not(new Not(notSimplified())),
      ],
      [
        new Nor([operand(false), new And([operand(true), notSimplified()])]),
        new Not(notSimplified()),
      ],
    ]
    for (const [nor, expected] of simplifyData) {
      it(`${nor} should simplify to ${expected}`, () => {
        assert.deepStrictEqual(nor.simplify({}, new Set([])), expected)
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
        assert.deepStrictEqual(new Nor(operands).serialize(defaultOptions), [
          'NOR',
          ...expected,
        ])
      })
    }
  })
})
