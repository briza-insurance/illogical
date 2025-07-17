import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { Overlap } from '../../overlap'

describe('Expression - Comparison - Overlap', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]], [[operand(5), operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new Overlap(...args)).toThrowError()
      }
    )
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [
      new Collection([new Value(1)]),
      new Collection([new Value(1), new Value(2)]),
      true,
    ],
    [
      new Collection([new Value(1), new Value(2)]),
      new Collection([new Value(1), new Value(2)]),
      true,
    ],
    [
      new Collection([new Value('1'), new Value('3')]),
      new Collection([new Value('1'), new Value('2')]),
      true,
    ],
    [new Collection([]), new Collection([]), true],
    // Truthy - Bi-directional
    [
      new Collection([new Value(1), new Value(2), new Value(5)]),
      new Collection([new Value(1), new Value(3)]),
      true,
    ],
    // Falsy
    [
      new Collection([new Value(0)]),
      new Collection([new Value(1), new Value(2)]),
      false,
    ],
    [
      new Collection([new Value('0')]),
      new Collection([new Value('1'), new Value('2')]),
      false,
    ],
    // Falsy - non-comparable types
    [
      new Collection([new Value('1')]),
      new Collection([new Value(1), new Value(2)]),
      false,
    ],
    [
      new Collection([new Value(1)]),
      new Collection([new Value('1'), new Value('2')]),
      false,
    ],
  ]

  describe('evaluate', () => {
    test.each(testCases)(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        expect(new Overlap(left, right).evaluate({})).toBe(expected)
      }
    )

    test.each([
      // Missing haystack
      [operand(1), operand(1)],
      // Missing needle
      [new Value(1), new Collection([new Value(1)])],
    ] as [Evaluable, Evaluable][])('%p and %p should throw', (left, right) => {
      expect(() => new Overlap(left, right).evaluate({})).toThrowError()
    })
  })

  describe('toString', () => {
    test.each([
      [
        new Collection([new Value(0)]),
        new Collection([new Value(1), new Value(2)]),
        '([0] overlap [1, 2])',
      ],
      [
        new Collection([new Value(1), new Value(2)]),
        new Collection([new Value(0)]),
        '([1, 2] overlap [0])',
      ],
    ] as [Evaluable, Evaluable, string][])(
      '%p and %p should be %p',
      (left, right, expected) => {
        expect(new Overlap(left, right).toString()).toBe(expected)
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
      const equal = new Overlap(left, right)
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
      expect(new Overlap(left, right).serialize(defaultOptions)).toEqual([
        'OVERLAP',
        ...serialized,
      ])
    })
  })
})
