import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import {
  notSimplified,
  operand,
  permutation,
} from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { NotEqual } from '../../ne.js'

describe('Expression - Comparison - Not Equal', () => {
  describe('constructor', () => {
    const constructorData = [
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]],
    ]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new NotEqual(...(args as Operand[])))
      })
    }
  })

  const primitives = [1, '1', true, false, undefined, null]
  const testCases: [Operand, Operand, boolean][] = [
    // Truthy - different types - across all permutations
    ...permutation(primitives).map<[Operand, Operand, boolean]>(
      ([left, right]) => [operand(left), operand(right), true]
    ),
    // Falsy cases - type A !== type A
    ...primitives.map<[Operand, Operand, boolean]>((value) => [
      operand(value),
      operand(value),
      false,
    ]),
    // Truthy
    [operand(1), operand(10), true],
    [operand('1'), operand('10'), true],
    // Truthy date cases
    [operand('2023-01-01'), operand('2022-12-31'), true],
    [operand('2023-01-01'), operand('2023-01-02'), true],
    // Falsy date cases
    [operand('2023-01-01'), operand('2023-01-01'), false],
    // Array types, truthy in any case
    [new Collection([new Value(1)]), new Collection([new Value(1)]), true],
    [new Collection([new Value('1')]), new Collection([new Value('1')]), true],
    [operand(1), new Collection([new Value(1)]), true],
    [operand('1'), new Collection([new Value('1')]), true],
  ]

  describe('evaluate', () => {
    for (const [left, right, expected] of testCases) {
      test(`${left} and ${right} should evaluate as ${expected}`, () => {
        assert.strictEqual(new NotEqual(left, right).evaluate({}), expected)
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
        const equal = new NotEqual(left, right)
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
          new NotEqual(left, right).serialize(defaultOptions),
          ['!=', ...serialized]
        )
      })
    }
  })
})
