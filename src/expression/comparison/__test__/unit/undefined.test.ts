import { Value } from '../../../../operand/value'
import { Undefined } from '../../undefined'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Undefined(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(undefined), true],
      // Falsy 
      [operand(1), false],
      [operand('1'), false],
      [operand(true), false],
      [operand(false), false],
      [operand(null), false],
      [new Collection([new Value(1)]), false],
      [new Collection([new Value('1')]), false]
    ] as [Evaluable, boolean][])
      ('%p should evaluate as %p', (operand, expected) => {
        expect(new Undefined(operand).evaluate({})).toBe(expected)
      })
  })
})
