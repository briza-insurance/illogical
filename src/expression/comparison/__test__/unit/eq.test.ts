import {
  notSimplified,
  operand,
  permutation,
} from '../../../../__test__/helpers'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { Equal } from '../../eq'

describe('Expression - Comparison - Equal', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]], [[operand(5), operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new Equal(...args)).toThrowError()
      }
    )
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
    test.each(testCases)(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        expect(new Equal(left, right).evaluate({})).toBe(expected)
      }
    )
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases,
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new Equal(left, right)
      const result = equal.simplify({}, new Set([]))
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    it.each<[Operand, Operand, [Input, Input]]>([
      [new Value(10), new Value(20), [10, 20]],
    ])('%p and %p should be serialized to %p', (left, right, serialized) => {
      expect(new Equal(left, right).serialize(defaultOptions)).toEqual([
        '==',
        ...serialized,
      ])
    })
  })
})
