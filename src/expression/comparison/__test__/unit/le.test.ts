import { Value } from '../../../../operand/value'
import { LessThanOrEqual } from '../../le'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Less Than or Equal', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new LessThanOrEqual(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(0), operand(1), true],
      [operand(1), operand(1), true],
      // Falsy 
      [operand(1), operand(0), false],
      // Falsy - non-comparable types
      [operand(0), operand('1'), false],
      [operand(0), operand(true), false],
      [operand(0), operand(false), false],
      [operand(0), operand(null), false],
      [operand(0), operand(undefined), false],
      [operand(0), new Collection([new Value(0)]), false],
      [operand(0), new Collection([new Value('0')]), false],
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new LessThanOrEqual(left, right).evaluate({})).toBe(expected)
      })
  })
})
