import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { NotIn } from '../../not-in'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

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

  describe('evaluate', () => {
    test.each([
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
    ] as [Evaluable, Evaluable, boolean][])
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
})
