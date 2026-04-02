import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Present } from '../../present.js'

describe('Expression - Comparison - Present', () => {
  describe('constructor', () => {
    const constructorData = [[], [operand(5), operand(5)]]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new Present(...(args as Operand[])))
      })
    }
  })

  const testCases: [Operand, boolean][] = [
    // Truthy
    [operand(1), true],
    [operand('1'), true],
    [operand(true), true],
    [operand(false), true],
    [new Collection([new Value(1)]), true],
    [new Collection([new Value('1')]), true],
    // Falsy
    [operand(undefined), false],
    [operand(null), false],
  ]

  describe('evaluate', () => {
    for (const [operandValue, expected] of testCases) {
      test(`${operandValue} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Present(operandValue).evaluate({}), expected)
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
        const equal = new Present(left)
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
      it(`${left} and ${serialized} should be serialized to ["PRESENT", ...${serialized}]`, () => {
        assert.deepStrictEqual(new Present(left).serialize(defaultOptions), [
          'PRESENT',
          ...serialized,
        ])
      })
    }
  })
})
