import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { GreaterThan } from '../../gt.js'

describe('Expression - Comparison - Greater Than', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]], [[operand(5), operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new GreaterThan(...args)).toThrowError()
      }
    )
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(1), operand(0), true],
    // Truthy date cases
    [operand('2023-01-01'), operand('2022-12-31'), true],
    // Falsy date cases
    [operand('2023-01-01'), operand('2023-01-01'), false],
    [operand('2023-01-01'), operand('2023-01-02'), false],
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
    test.each(testCases)(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        expect(new GreaterThan(left, right).evaluate({})).toBe(expected)
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
      const equal = new GreaterThan(left, right)
      const result = equal.simplify({}, new Set([]))
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
      expect(new GreaterThan(left, right).serialize(defaultOptions)).toEqual([
        '>',
        ...serialized,
      ])
    })
  })
})
