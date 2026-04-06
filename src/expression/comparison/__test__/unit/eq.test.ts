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
import { Equal } from '../../eq.js'

describe('Expression - Comparison - Equal', () => {
  describe('constructor', () => {
    const constructorData: Operand[][] = [
      [],
      [operand(5)],
      [operand(5), operand(5), operand(5)],
    ]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new Equal(...args))
      })
    }
  })

  const primitives = [1, '1', true, false, undefined, null]
  const testCases: [Operand, Operand, boolean][] = [
    // Truthy cases - type A === type A
    ...primitives.map<[Operand, Operand, boolean]>((value) => [
      operand(value),
      operand(value),
      true,
    ]),
    // Truthy date Cases
    [operand('2023-01-01'), operand('2023-01-01'), true],
    // Falsy date Cases
    [operand('2023-01-01'), operand('2022-12-31'), false],
    [operand('2023-01-01'), operand('2023-01-02'), false],
    // Falsy - different types - across all permutations
    ...permutation(primitives).map<[Operand, Operand, boolean]>(
      ([left, right]) => [operand(left), operand(right), false]
    ),
    // Falsy
    [operand(1), operand(10), false],
    [operand('1'), operand('10'), false],
    // Array types, falsy in any case
    [new Collection([new Value(1)]), new Collection([new Value(1)]), false],
    [new Collection([new Value('1')]), new Collection([new Value('1')]), false],
    [operand(1), new Collection([new Value(1)]), false],
    [operand('1'), new Collection([new Value('1')]), false],
  ]

  describe('evaluate', () => {
    for (const [left, right, expected] of testCases) {
      test(`${left} and ${right} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Equal(left, right).evaluate({}), expected)
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
        const equal = new Equal(left, right)
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
          new Equal(left, right).serialize(defaultOptions),
          ['==', ...serialized]
        )
      })
    }
  })
})
