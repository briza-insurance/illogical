import { Value } from '../../../../operand/value'
import { GreaterThan } from '../../gt'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Greater Than', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new GreaterThan(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(1), operand(0), true],
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
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new GreaterThan(left, right).evaluate({})).toBe(expected)
      })
  })
})
