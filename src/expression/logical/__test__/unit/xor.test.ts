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
import { Xor } from '../../xor.js'

describe('Expression - Logical - Xor', () => {
  describe('evaluate', () => {
    const evaluateData = [
      // Truthy
      [[operand(true), operand(false)], true],
      [[operand(false), operand(true)], true],
      // Falsy
      [[operand(true), operand(true)], false],
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][]
    for (const [operands, expected] of evaluateData) {
      test(`${operands} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Xor(operands).evaluate({}), expected)
      })
    }

    const evaluateThrowData = [[[]]] as [Evaluable[]][]
    for (const operands of evaluateThrowData) {
      test(`${operands} should throw`, () => {
        assert.throws(() => new Xor(operands).evaluate({}))
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Xor, Evaluable | boolean][] = [
      [new Xor([notSimplified(), operand(false)]), notSimplified()],
      [
        new Xor([notSimplified(), operand(true), notSimplified()]),
        new Nor([notSimplified(), notSimplified()]),
      ],
      [
        new Xor([notSimplified(), operand(true), operand(false)]),
        new Not(notSimplified()),
      ],
      [new Xor([operand(false), operand(true)]), true],
      [new Xor([operand(false), operand(false)]), false],
      [new Xor([operand(true), operand(true), operand(true)]), false],
      [new Xor([operand(true), notSimplified(), operand(true)]), false],
      [
        new Xor([notSimplified(), operand(false), notSimplified()]),
        new Xor([notSimplified(), notSimplified()]),
      ],
      [
        new Xor([
          new And([notSimplified(), operand(true)]),
          operand(true),
          operand(false),
        ]),
        new Not(notSimplified()),
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
        assert.deepStrictEqual(new Xor(operands).serialize(defaultOptions), [
          'XOR',
          ...expected,
        ])
      })
    }
  })
})
