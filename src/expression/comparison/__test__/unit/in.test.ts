import { Value } from '../../../../operand/value'
import { In } from '../../in'
import { Collection } from '../../../../operand/collection'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'

describe('Expression - Comparison - In', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new In(...(args))).toThrowError()
    })
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(1), new Collection([new Value(1), new Value(2)]), true],
    [operand('1'), new Collection([new Value('1'), new Value('2')]), true],
    [operand(true), new Collection([new Value(true), new Value(false)]), true],
    // Truthy - Bi-directional
    [new Collection([new Value(1), new Value(2)]), new Value(1), true],
    [new Collection([new Value('1'), new Value('2')]), new Value('1'), true],
    [new Collection([new Value(true), new Value(false)]), new Value(true), true],
    // Falsy
    [operand(0), new Collection([new Value(1), new Value(2)]), false],
    [operand('0'), new Collection([new Value('1'), new Value('2')]), false],
    [operand(true), new Collection([new Value(false), new Value(false)]), false],
    // Falsy - non-comparable types
    [operand('0'), new Collection([new Value(0), new Value(1)]), false],
    [operand(0), new Collection([new Value('0'), new Value('1')]), false],
  ]

  describe('evaluate', () => {
    test.each(testCases)
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new In(left, right).evaluate({})).toBe(expected)
      })

    test.each([
      // Missing haystack
      [operand(1), operand(1)],
      // Double haystack
      [new Collection([new Value(1)]), new Collection([new Value(1)])],
    ] as [Evaluable, Evaluable][])
      ('%p and %p should throw', (left, right) => {
        expect(() => new In(left, right).evaluate({})).toThrowError()
      })
  })

  describe('toString', () => {
    test.each([
      [new Value(0), new Collection([new Value(1), new Value(2)]), '(0 in [1, 2])'],
      [new Collection([new Value(1), new Value(2)]), new Value(0), '(0 in [1, 2])'],
    ] as [Evaluable, Evaluable, string][])
      ('%p and %p should be %p', (left, right, expected) => {
        expect(new In(left, right).toString()).toBe(expected)
      })
  })

  describe('simplify', () => {
    test.each<[Operand, Operand, boolean | 'self']>([
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases
    ])('%p and %p should be simplified to $p', (left, right, expected) => {
      const equal = new In(left, right)
      const result = equal.simplify({})
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })
})
