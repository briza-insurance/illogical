import { Value } from '../../../../operand/value'
import { LessThanOrEqual } from '../../le'
import { Collection } from '../../../../operand/collection'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'

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

  const testCases: [Operand, Operand, boolean][] = [
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
  ]

  describe('evaluate', () => {
    test.each(testCases)
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new LessThanOrEqual(left, right).evaluate({})).toBe(expected)
      })
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new LessThanOrEqual(left, right)
      const result = equal.simplify({})
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })
})
