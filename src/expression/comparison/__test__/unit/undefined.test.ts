import { Value } from '../../../../operand/value'
import { Undefined } from '../../undefined'
import { Collection } from '../../../../operand/collection'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'

describe('Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Undefined(...(args))).toThrowError()
    })
  })

  const testCases: [Operand, boolean][] = [
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
  ]

  describe('evaluate', () => {
    test.each(testCases)
      ('%p should evaluate as %p', (operand, expected) => {
        expect(new Undefined(operand).evaluate({})).toBe(expected)
      })
  })

  describe('simplify', () => {
    test.each<[Operand, boolean | 'self']>([
      [notSimplified(), 'self'],
      ...testCases
    ])('%p should be simplified to $p', (left, expected) => {
      const equal = new Undefined(left)
      const result = equal.simplify({})
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })
})
