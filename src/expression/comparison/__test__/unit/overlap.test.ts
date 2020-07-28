import { Value } from '../../../../operand/value'
import { Overlap } from '../../overlap'
import { Collection } from '../../../../operand/collection'
import { operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'

describe('Expression - Comparison - Overlap', () => {
  describe('constructor', () => {
    test.each([
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]]
    ])('arguments %p should throw', (args) => {
      expect(() => new Overlap(...(args))).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      // Truthy
      [new Collection([new Value(1)]), new Collection([new Value(1), new Value(2)]), true],
      [new Collection([new Value(1), new Value(2)]), new Collection([new Value(1), new Value(2)]), true],
      [new Collection([new Value('1'), new Value('3')]), new Collection([new Value('1'), new Value('2')]), true],
      // Truthy - Bi-directional
      [new Collection([new Value(1), new Value(2), new Value(5)]), new Collection([new Value(1), new Value(3)]), true],
      // Falsy
      [new Collection([new Value(0)]), new Collection([new Value(1), new Value(2)]), false],
      [new Collection([new Value('0')]), new Collection([new Value('1'), new Value('2')]), false],
      // Falsy - non-comparable types
      [new Collection([new Value('1')]), new Collection([new Value(1), new Value(2)]), false],
      [new Collection([new Value(1)]), new Collection([new Value('1'), new Value('2')]), false]
    ] as [Evaluable, Evaluable, boolean][])
      ('%p and %p should evaluate as %p', (left, right, expected) => {
        expect(new Overlap(left, right).evaluate({})).toBe(expected)
      })

    test.each([
      // Missing haystack
      [operand(1), operand(1)],
      // Missing needle
      [new Value(1), new Collection([new Value(1)])],
    ] as [Evaluable, Evaluable][])
      ('%p and %p should throw', (left, right) => {
        expect(() => new Overlap(left, right).evaluate({})).toThrowError()
      })
  })

  describe('toString', () => {
    test.each([
      [new Collection([new Value(0)]), new Collection([new Value(1), new Value(2)]), '([0] overlap [1, 2])'],
      [new Collection([new Value(1), new Value(2)]), new Collection([new Value(0)]), '([1, 2] overlap [0])'],
    ] as [Evaluable, Evaluable, string][])
      ('%p and %p should be %p', (left, right, expected) => {
        expect(new Overlap(left, right).toString()).toBe(expected)
      })
  })
})
