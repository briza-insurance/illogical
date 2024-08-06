import { notSimplified, operand } from '../../../../__test__/helpers'
import { Result } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Value } from '../../../../operand/value'
import { defaultOptions } from '../../../../parser/options'
import { Divide, OPERATOR } from '../../divide'

describe('Expression - Arithmetic - Divide', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]]])('arguments %p should throw', (args) => {
      expect(() => new Divide(...args)).toThrowError(
        'divide expression requires at least 2 operands'
      )
    })
  })

  const testCases: [Result, ...Operand[]][] = [
    [2, operand(20), operand(10)],
    [0.016666666666666666, operand(10), operand(20), operand(30)],
    [-0.5, operand(10), operand(-20)],
    [-0.5, operand(-10), operand(20)],
    [0.5, operand(-10), operand(-20)],
    [Infinity, operand(10), operand(0)],
    [-0, operand(0), operand(-10)],
    [NaN, operand(0), operand(0)],
    [2.3333333333333335, operand(2.8), operand(1.2)],
    [2.0999999099999913, operand(2.333333), operand(1.111111)],
    [4, operand(0.4), operand(0.1)],
    [1, operand(1.333), operand(1.333)],
  ]

  describe('evaluate', () => {
    test.each(testCases)(
      'that %p is the result of dividing %p',
      (expected, ...operands) => {
        expect(new Divide(...operands).evaluate({})).toBe(expected)
      }
    )
  })

  describe('evaluate - failure', () => {
    it.each<[...Operand[]]>([
      [operand('string1'), operand(2)],
      [operand('string1'), operand('string2')],
      [operand(1), operand('string2')],
      [operand(null), operand(1)],
      [operand(undefined), operand(1)],
    ])('%p and %p should throw', (...operands) => {
      expect(() => new Divide(...operands).evaluate({})).toThrowError(
        'operands must be numbers for divide'
      )
    })
  })

  describe('toString', () => {
    it.each<[string, ...Value[]]>([
      ['(5 / 6)', new Value(5), new Value(6)],
      [
        '(1 / 2 / 3 / 4)',
        new Value(1),
        new Value(2),
        new Value(3),
        new Value(4),
      ],
      ['(5 / -6)', new Value(5), new Value(-6)],
    ])('should stringify into %p', (expectedResult, ...values) => {
      const result = new Divide(...values).toString()
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
      const division = new Divide(...operands)
      const result = division.simplify({}, [])
      if (expected === 'self') {
        expect(result).toBe(division)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    it('%p and %p should be serialized to %p', () => {
      expect(
        new Divide(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_DIVIDE']]),
        })
      ).toEqual(['CUSTOM_DIVIDE', 10, 20])
    })

    it('should throw if operator symbol is not mapped', () => {
      expect(() =>
        new Divide(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map<symbol, string>(),
        })
      ).toThrowError()
    })
  })
})
