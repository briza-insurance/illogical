import { notSimplified, operand } from '../../../../__test__/helpers'
import { Operand } from '../../../../operand'
import { Collection } from '../../../../operand/collection'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { Prefix } from '../../prefix'

describe('Expression - Comparison - Prefix', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]], [[operand(5), operand(5), operand(5)]]])(
      'arguments %p should throw',
      (args) => {
        expect(() => new Prefix(...args)).toThrowError()
      }
    )
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand('a'), operand('abc'), true],
    [operand('a'), operand('a'), true],
    // Falsy
    [operand('b'), operand('abc'), false],
    [operand('b'), operand(''), false],
    // Falsy - non-comparable types
    [operand('a'), operand(1), false],
    [operand('a'), operand(true), false],
    [operand('a'), operand(false), false],
    [operand('a'), operand(null), false],
    [operand('a'), operand(undefined), false],
    [operand('a'), new Collection([new Value(0)]), false],
    [operand('a'), new Collection([new Value('0')]), false],
    [operand(1), operand('a'), false],
  ]

  describe('evaluate', () => {
    test.each(testCases)(
      '%p and %p should evaluate as %p',
      (left, right, expected) => {
        expect(new Prefix(left, right).evaluate({})).toBe(expected)
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
      const equal = new Prefix(left, right)
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
      expect(new Prefix(left, right).serialize(defaultOptions)).toEqual([
        'PREFIX',
        ...serialized,
      ])
    })
  })
})
