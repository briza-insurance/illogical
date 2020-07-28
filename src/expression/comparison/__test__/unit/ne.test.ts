import { operand, permutation } from '../../../../__test__/helpers'
import { Value } from '../../../../operand/value'
import { NotEqual } from '../../ne'
import { Collection } from '../../../../operand/collection'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Not Equal', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new NotEqual(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    const primitives = [1, '1', true, false, undefined, null]
    test.each([
      // Truthy - different types - across all permutations
      ...permutation(primitives).map(([left, right]) => [operand(left), operand(right), true]),
      // Falsy cases - type A !== type A
      ...primitives.map((value) => [operand(value), operand(value), false]),
      // Truthy
      [operand(1), operand(10), true],
      [operand('1'), operand('10'), true],
      // Array types, truthy in any case
      [new Collection([new Value(1)]), new Collection([new Value(1)]), true],
      [new Collection([new Value('1')]), new Collection([new Value('1')]), true],
      [operand(1), new Collection([new Value(1)]), true],
      [operand('1'), new Collection([new Value('1')]), true]
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new NotEqual(left, right).evaluate({})).toBe(expected)
      })
  })
})
