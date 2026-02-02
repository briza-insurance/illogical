import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Undefined } from '../../undefined.js'

describe('Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new Undefined(...args)).toThrowError()
      }
    )
  })

  const testCases: [Operand, boolean][] = [
    // Truthy
    [operand(undefined), true],
    // Falsy
    [operand(1), false],
    [operand('1'), false],
    [operand(true), false],
    [operand(false), false],
    [operand(null), false],
    [new Collection([new Value(1)]), false],
    [new Collection([new Value('1')]), false],
  ]

  describe('evaluate', () => {
    test.each(testCases)('%p should evaluate as %p', (operand, expected) => {
      expect(new Undefined(operand).evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    test.each<[Operand, boolean | 'self']>([
      [notSimplified(), 'self'],
      ...testCases,
    ])('%p should be simplified to $p', (left, expected) => {
      const equal = new Undefined(left)
      const result = equal.simplify({}, new Set([]))
      if (expected === 'self') {
        expect(result).toBe(equal)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    it.each<[Operand, [Input]]>([[new Value(10), [10]]])(
      '%p and %p should be serialized to %p',
      (left, serialized) => {
        expect(new Undefined(left).serialize(defaultOptions)).toEqual([
          'UNDEFINED',
          ...serialized,
        ])
      }
    )
  })
})
