import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { GreaterThan } from '../../gt.js'

describe('Expression - Comparison - Greater Than', () => {
  describe('constructor', () => {
    const constructorData = [
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]],
    ]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new GreaterThan(...(args as Operand[])))
      })
    }
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(1), operand(0), true],
    // Truthy date cases
    [operand('2023-01-01'), operand('2022-12-31'), true],
    // Falsy date cases
    [operand('2023-01-01'), operand('2023-01-01'), false],
    [operand('2023-01-01'), operand('2023-01-02'), false],
    // Falsy
    [operand(1), operand(1), false],
    [operand(0), operand(1), false],
    // Falsy - non-comparable types
    [operand(1), operand('0'), false],
    [operand(1), operand(true), false],
    [operand(1), operand(false), false],
    [operand(1), operand(null), false],
    [operand(1), operand(undefined), false],
    [operand(1), new Collection([new Value(0)]), false],
    [operand(1), new Collection([new Value('0')]), false],
  ]

  describe('evaluate', () => {
    for (const [left, right, expected] of testCases) {
      test(`${left} and ${right} should evaluate as ${expected}`, () => {
        assert.strictEqual(new GreaterThan(left, right).evaluate({}), expected)
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
        const equal = new GreaterThan(left, right)
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
          new GreaterThan(left, right).serialize(defaultOptions),
          ['>', ...serialized]
        )
      })
    }
  })
})
