import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { LessThan } from '../../lt.js'

describe('Expression - Comparison - Less Than', () => {
  describe('constructor', () => {
    const constructorData = [
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]],
    ]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new LessThan(...(args as Operand[])))
      })
    }
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(0), operand(1), true],
    // Truthy date cases
    [operand('2023-01-01'), operand('2023-01-02'), true],
    // Falsy date cases
    [operand('2023-01-01'), operand('2022-12-31'), false],
    [operand('2023-01-01'), operand('2023-01-01'), false],
    // Falsy
    [operand(1), operand(1), false],
    [operand(1), operand(0), false],
    // Falsy - non-comparable types
    [operand(0), operand('1'), false],
    [operand(0), operand(true), false],
    [operand(0), operand(false), false],
    [operand(0), operand(null), false],
    [operand(0), operand(undefined), false],
    [operand(0), new Collection([new Value(0)]), false],
    [operand(0), new Collection([new Value('0')]), false],
  ]

  describe('evaluate', () => {
    for (const [left, right, expected] of testCases) {
      test(`${left} and ${right} should evaluate as ${expected}`, () => {
        assert.strictEqual(new LessThan(left, right).evaluate({}), expected)
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Operand, Operand, boolean | 'self'][] = [
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases,
    ]
    for (const [left, right, expected] of simplifyData) {
      test(`${left} and ${right} should be simplified to ${expected}`, () => {
        const equal = new LessThan(left, right)
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
    const serializeData: [Operand, Operand, [Input, Input]][] = [
      [new Value(10), new Value(20), [10, 20]],
    ]
    for (const [left, right, serialized] of serializeData) {
      it(`${left} and ${right} should be serialized to ${serialized}`, () => {
        assert.deepStrictEqual(
          new LessThan(left, right).serialize(defaultOptions),
          ['<', ...serialized]
        )
      })
    }
  })
})
