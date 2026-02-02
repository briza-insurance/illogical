import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Result } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { defaultOptions } from '../../../../parser/options.js'
import { OPERATOR, Sum } from '../../sum.js'

describe('Expression - Arithmetic - Sum', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]]])('arguments %p should throw', (args) => {
      expect(() => new Sum(...args)).toThrow(
        'sum expression requires at least 2 operands'
      )
    })
  })

  const testCases: [Result, ...Operand[]][] = [
    [30, operand(10), operand(20)],
    [60, operand(10), operand(20), operand(30)],
    [-10, operand(10), operand(-20)],
    [10, operand(-10), operand(20)],
    [-30, operand(-10), operand(-20)],
    [10, operand(10), operand(0)],
    [10, operand(0), operand(10)],
    [0, operand(0), operand(0)],
    [0.3, operand(0.2), operand(0.1)],
    [4, operand(1.2), operand(2.8)],
    [0, operand(1.333), operand(-1.333)],
    [false, operand(null), operand(1)],
    [false, operand(undefined), operand(1)],
  ]

  describe('evaluate', () => {
    test.each(testCases)(
      'that %p is the result of summing %p',
      (expected, ...operands) => {
        expect(new Sum(...operands).evaluate({})).toBe(expected)
      }
    )
  })

  describe('evaluate - failure', () => {
    it.each<[...Operand[]]>([
      [operand('string1'), operand(2)],
      [operand('string1'), operand('string2')],
      [operand(1), operand('string2')],
    ])('%p and %p should throw', (...operands) => {
      expect(() => new Sum(...operands).evaluate({})).toThrow(
        'operands must be numbers for Sum'
      )
    })
  })

  describe('toString', () => {
    it.each<[string, ...Value[]]>([
      ['(5 + 6)', new Value(5), new Value(6)],
      [
        '(1 + 2 + 3 + 4)',
        new Value(1),
        new Value(2),
        new Value(3),
        new Value(4),
      ],
      ['(5 + -6)', new Value(5), new Value(-6)],
    ])('should stringify into %p', (expectedResult, ...values) => {
      const result = new Sum(...values).toString()
      expect(result).toEqual(expectedResult)
    })
  })

  describe('simplify', () => {
    test.each<[Result | 'self', ...Operand[]]>([
      ['self', operand(10), notSimplified()],
      ['self', notSimplified(), operand(10)],
      ['self', notSimplified(), notSimplified()],
      ...testCases,
    ])('if %p is the simplification of %p', (expected, ...operands) => {
      const sum = new Sum(...operands)
      const result = sum.simplify({}, new Set([]))
      if (expected === 'self') {
        expect(result).toBe(sum)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    it('%p and %p should be serialized to %p', () => {
      expect(
        new Sum(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_SUM']]),
        })
      ).toEqual(['CUSTOM_SUM', 10, 20])
    })

    it('should throw if operator symbol is not mapped', () => {
      expect(() =>
        new Sum(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map<symbol, string>(),
        })
      ).toThrow()
    })
  })
})
