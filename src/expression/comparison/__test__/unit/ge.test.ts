import { Value } from '../../../../operand/value'
import { GreaterThanOrEqual } from '../../ge'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Greater Than or Equal', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new GreaterThanOrEqual(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(1), operand(0), true],
      [operand(1), operand(1), true],
      // Falsy 
      [operand(0), operand(1), false],
      // Falsy - non-comparable types
      [operand(1), operand('0'), false],
      [operand(1), operand(true), false],
      [operand(1), operand(false), false],
      [operand(1), operand(null), false],
      [operand(1), operand(undefined), false],
      [operand(1), new Collection([new Value(0)]), false],
      [operand(1), new Collection([new Value('0')]), false],
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new GreaterThanOrEqual(left, right).evaluate({})).toBe(expected)
      })
  })
})
