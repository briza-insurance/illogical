import { operand, permutation } from '../../../../__test__/helpers'
import { Value } from '../../../../operand/value'
import { Equal } from '../../eq'
import { Collection } from '../../../../operand/collection'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Equal', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Equal(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    const primitives = [1, '1', true, false, undefined, null]
    test.each([
      // Truthy cases - type A === type A
      ...primitives.map((value) => [operand(value), operand(value), true]),
      // Falsy - different types - across all permutations
      ...permutation(primitives).map(([left, right]) => [operand(left), operand(right), false]),
      // Falsy
      [operand(1), operand(10), false],
      [operand('1'), operand('10'), false],
      // Array types, falsy in any case
      [new Collection([new Value(1)]), new Collection([new Value(1)]), false],
      [new Collection([new Value('1')]), new Collection([new Value('1')]), false],
      [operand(1), new Collection([new Value(1)]), false],
      [operand('1'), new Collection([new Value('1')]), false]
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new Equal(left, right).evaluate({})).toBe(expected)
      })
  })
})
