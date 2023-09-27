import { notSimplified, operand } from '../../../../__test__/helpers'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { LessThan } from '../../lt'

describe('Expression - Comparison - Less Than', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]], [[operand(5), operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new LessThan(...args)).toThrowError()
      }
    )
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(0), operand(1), true],
    // Truthy date cases
    [operand('2023-01-01'), operand('2023-01-02'), true],
    // Falsy date cases
    [operand('2023-01-01'), operand('2022-12-31'), false],
    [operand('2023-01-01'), operand('2023-01-01'), false],
    // Falsy
    [operand(1), operand(1), false],
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
    test.each(testCases)(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        expect(new LessThan(left, right).evaluate({})).toBe(expected)
      }
    )
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases,
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new LessThan(left, right)
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
      [new Value(10), new Value(20), [10, 20]],
    ])('%p and %p should be serialized to %p', (left, right, serialized) => {
      expect(new LessThan(left, right).serialize(defaultOptions)).toEqual([
        '<',
        ...serialized,
      ])
    })
  })
})
