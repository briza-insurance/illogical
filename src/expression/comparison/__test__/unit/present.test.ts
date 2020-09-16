import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { Present } from '../../present'

describe('Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Present(...(args))).toThrowError()
    })
  })

  const testCases: [Operand, boolean][] = [
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
  ]

  describe('evaluate', () => {
    test.each(testCases)
      ('%p should evaluate as %p', (operand, expected) => {
        expect(new Present(operand).evaluate({})).toBe(expected)
      })
  })

  describe('simplify', () => {
    test.each<[Operand, boolean | 'self']>([
      [notSimplified(), 'self'],
      ...testCases
    ])('%p should be simplified to $p', (left, expected) => {
      const equal = new Present(left)
      const result = equal.simplify({})
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })
})
