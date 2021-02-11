import { notSimplified, operand } from '../../../../__test__/helpers'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { Undefined } from '../../undefined'

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
      const result = equal.simplify({}, [])
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
