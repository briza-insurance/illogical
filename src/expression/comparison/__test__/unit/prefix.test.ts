import { Value } from '../../../../operand/value'
import { Prefix } from '../../prefix'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Prefix', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Prefix(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand('a'), operand('abc'), true],
      [operand('a'), operand('a'), true],
      // Falsy
      [operand('b'), operand('abc'), false],
      [operand('b'), operand(''), false],
      // Falsy - non-comparable types
      [operand('a'), operand(1), false],
      [operand('a'), operand(true), false],
      [operand('a'), operand(false), false],
      [operand('a'), operand(null), false],
      [operand('a'), operand(undefined), false],
      [operand('a'), new Collection([new Value(0)]), false],
      [operand('a'), new Collection([new Value('0')]), false],
      [operand(1), operand('a'), false],
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new Prefix(left, right).evaluate({})).toBe(expected)
      })
  })
})
