import { Value } from '../../../../operand/value'
import { GreaterThan } from '../../gt'
import { Collection } from '../../../../operand/collection'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'

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

  const testCases: [Operand, Operand, boolean][] = [
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
  ]

  describe('evaluate', () => {
    test.each(testCases)
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new GreaterThan(left, right).evaluate({})).toBe(expected)
      })
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new GreaterThan(left, right)
      const result = equal.simplify({})
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })
})
