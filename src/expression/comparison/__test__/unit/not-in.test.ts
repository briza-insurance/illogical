import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { NotIn } from '../../not-in'

describe('Expression - Comparison - Not In', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new NotIn(...(args))).toThrowError()
    })
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(0), new Collection([new Value(1), new Value(2)]), true],
    [operand('0'), new Collection([new Value('1'), new Value('2')]), true],
    [operand(true), new Collection([new Value(false), new Value(false)]), true],
    // Truthy - Bi-directional
    [new Collection([new Value(1), new Value(2)]), new Value(0), true],
    [new Collection([new Value('1'), new Value('2')]), new Value('0'), true],
    [new Collection([new Value(false), new Value(false)]), new Value(true), true],
    // Truthy - non-comparable types
    [operand('0'), new Collection([new Value(0), new Value(1)]), true],
    [operand(0), new Collection([new Value('0'), new Value('1')]), true],
    // Falsy
    [operand(1), new Collection([new Value(1), new Value(2)]), false],
    [operand('1'), new Collection([new Value('1'), new Value('2')]), false],
    [operand(false), new Collection([new Value(false), new Value(false)]), false]
  ]

  describe('evaluate', () => {
    test.each(testCases)
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new NotIn(left, right).evaluate({})).toBe(expected)
      })

    test.each([
      // Missing haystack
      [operand(1), operand(1)],
      // Double haystack
      [new Collection([new Value(1)]), new Collection([new Value(1)])],
    ] as [Evaluable, Evaluable][])
      ('%p and %p should throw', (left, right) => {
        expect(() => new NotIn(left, right).evaluate({})).toThrowError()
      })
  })

  describe('toString', () => {
    test.each([
      [new Value(0), new Collection([new Value(1), new Value(2)]), '(0 not in [1, 2])'],
      [new Collection([new Value(1), new Value(2)]), new Value(0), '(0 not in [1, 2])'],
    ] as [Evaluable, Evaluable, string][])
      ('%p and %p should be %p', (left, right, expected) => {
        expect(new NotIn(left, right).toString()).toBe(expected)
      })
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new NotIn(left, right)
      const result = equal.simplify({})
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
      expect(new NotIn(left, right).serialize(defaultOptions)).toEqual(['NOT IN', ...serialized])
    })
  })
})
