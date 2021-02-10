import { notSimplified, operand } from '../../../../__test__/helpers'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { GreaterThanOrEqual } from '../../ge'

describe('Expression - Comparison - Greater Than or Equal', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]], [[operand(5), operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new GreaterThanOrEqual(...args)).toThrowError()
      }
    )
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(1), operand(0), true],
    [operand(1), operand(1), true],
    // Falsy
    [operand(0), operand(1), false],
    // Falsy - non-comparable types
    [operand(1), operand(true), false],
    [operand(1), operand(false), false],
    [operand(1), operand(null), false],
    [operand(1), operand(undefined), false],
    [operand(1), new Collection([new Value(0)]), false],
    [operand(1), new Collection([new Value('0')]), false]
  ]

  const crossTypeParsingTestCases = (
    testStatus: boolean
  ): [Operand, Operand, boolean][] => {
    return [
      [operand(1), operand('0'), testStatus],
      [operand('1'), operand('1'), testStatus]
    ]
  }

  describe('evaluate without cross type parsing', () => {
    test.each([...testCases, ...crossTypeParsingTestCases(false)])(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        expect(new GreaterThanOrEqual(left, right).evaluate({})).toBe(expected)
      }
    )
  })

  describe('evaluate with cross type parsing', () => {
    test.each([...testCases, ...crossTypeParsingTestCases(true)])(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        const comparison = new GreaterThanOrEqual(left, right)
        comparison.strict = false
        expect(comparison.evaluate({})).toBe(expected)
      }
    )
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new GreaterThanOrEqual(left, right)
      const result = equal.simplify({}, [])
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    it.each<[Operand, Operand, [Input, Input]]>([
      [new Value(10), new Value(20), [10, 20]]
    ])('%p and %p should be serialized to %p', (left, right, serialized) => {
      expect(
        new GreaterThanOrEqual(left, right).serialize(defaultOptions)
      ).toEqual(['>=', ...serialized])
    })
  })
})
