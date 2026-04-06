import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Reference } from '../../../../operand/reference.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Or } from '../../or.js'

describe('Expression - Logical - Or', () => {
  describe('evaluate', () => {
    const evaluateData = [
      // Truthy
      [[operand(true), operand(false)], true],
      [[operand(false), operand(true)], true],
      [[operand(true), operand(true)], true],
      // Falsy
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][]
    for (const [operands, expected] of evaluateData) {
      test(`${operands} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Or(operands).evaluate({}), expected)
      })
    }

    const evaluateThrowData: Evaluable[][] = [[]]
    for (const operands of evaluateThrowData) {
      test(`${operands} should throw`, () => {
        assert.throws(() => new Or(operands).evaluate({}))
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Or, Evaluable | boolean][] = [
      [new Or([notSimplified(), operand(false)]), notSimplified()],
      [new Or([notSimplified(), operand(true), notSimplified()]), true],
      [new Or([operand(false), operand(true)]), true],
      [new Or([operand(false), operand(false)]), false],
      [
        new Or([notSimplified(), operand(false), notSimplified()]),
        new Or([notSimplified(), notSimplified()]),
      ],
      [
        new Or([operand(false), new Or([operand(false), notSimplified()])]),
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
        assert.deepStrictEqual(new Or(operands).serialize(defaultOptions), [
          'OR',
          ...expected,
        ])
      })
    }
  })
})
