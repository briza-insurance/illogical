import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Undefined } from '../../undefined.js'

describe('Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    const constructorData = [[], [operand(5), operand(5)]]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new Undefined(...(args as Operand[])))
      })
    }
  })

  const testCases: [Operand, boolean][] = [
    // Truthy
    [operand(undefined), true],
    // Falsy
    [operand(1), false],
    [operand('1'), false],
    [operand(true), false],
    [operand(false), false],
    [operand(null), false],
    [new Collection([new Value(1)]), false],
    [new Collection([new Value('1')]), false],
  ]

  describe('evaluate', () => {
    for (const [operandValue, expected] of testCases) {
      test(`${operandValue} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Undefined(operandValue).evaluate({}), expected)
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Operand, boolean | 'self'][] = [
      [notSimplified(), 'self'],
      ...testCases,
    ]
    for (const [left, expected] of simplifyData) {
      test(`${left} should be simplified to ${expected}`, () => {
        const equal = new Undefined(left)
        const result = equal.simplify({}, new Set([]))
        if (expected === 'self') {
          assert.strictEqual(result, equal)
        } else {
          assert.deepStrictEqual(result, expected)
        }
      })
    }
  })

  describe('serialize', () => {
    const serializeData: [Operand, [Input]][] = [[new Value(10), [10]]]
    for (const [left, serialized] of serializeData) {
      it(`${left} and ${serialized} should be serialized to ["UNDEFINED", ...${serialized}]`, () => {
        assert.deepStrictEqual(new Undefined(left).serialize(defaultOptions), [
          'UNDEFINED',
          ...serialized,
        ])
      })
    }
  })
})
