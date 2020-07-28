import { Present } from '../../present'
import { Value } from '../../../../operand/value'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Present(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(1), true],
      [operand('1'), true],
      [operand(true), true],
      [operand(false), true],
      [new Collection([new Value(1)]), true],
      [new Collection([new Value('1')]), true],
      // Falsy
      [operand(undefined), false],
      [operand(null), false]
    ] as [Evaluable, boolean][])
      ('%p should evaluate as %p', (operand, expected) => {
        expect(new Present(operand).evaluate({})).toBe(expected)
      })
  })
})
