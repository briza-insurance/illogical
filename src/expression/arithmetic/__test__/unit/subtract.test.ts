import { notSimplified, operand } from '../../../../__test__/helpers'
import { Result } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Value } from '../../../../operand/value'
import { defaultOptions } from '../../../../parser/options'
import { OPERATOR, Subtract } from '../../subtract'

describe('Expression - Arithmetic - Subtract', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]]])('arguments %p should throw', (args) => {
      expect(() => new Subtract(...args)).toThrow(
        'subtract expression requires at least 2 operands'
      )
    })
  })

  const testCases: [Result, ...Operand[]][] = [
    [10, operand(20), operand(10)],
    [-40, operand(10), operand(20), operand(30)],
    [30, operand(10), operand(-20)],
    [-30, operand(-10), operand(20)],
    [10, operand(-10), operand(-20)],
    [10, operand(10), operand(0)],
    [-10, operand(0), operand(10)],
    [0, operand(0), operand(0)],
    [1.6, operand(2.8), operand(1.2)],
    [1.222222, operand(2.333333), operand(1.111111)],
    [0.3, operand(0.4), operand(0.1)],
    [0, operand(1.333), operand(1.333)],
    [false, operand(null), operand(1)],
    [false, operand(undefined), operand(1)],
  ]

  describe('evaluate', () => {
    test.each(testCases)(
      'that %p is the result of subtracting %p',
      (expected, ...operands) => {
        expect(new Subtract(...operands).evaluate({})).toBe(expected)
      }
    )
  })

  describe('evaluate - failure', () => {
    it.each<[...Operand[]]>([
      [operand('string1'), operand(2)],
      [operand('string1'), operand('string2')],
      [operand(1), operand('string2')],
    ])('%p and %p should throw', (...operands) => {
      expect(() => new Subtract(...operands).evaluate({})).toThrow(
        'operands must be numbers for Subtract'
      )
    })
  })

  describe('toString', () => {
    it.each<[string, ...Value[]]>([
      ['(5 - 6)', new Value(5), new Value(6)],
      [
        '(1 - 2 - 3 - 4)',
        new Value(1),
        new Value(2),
        new Value(3),
        new Value(4),
      ],
      ['(5 - -6)', new Value(5), new Value(-6)],
    ])('should stringify into %p', (expectedResult, ...values) => {
      const result = new Subtract(...values).toString()
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
      const sum = new Subtract(...operands)
      const result = sum.simplify({}, [])
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
        new Subtract(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_SUBTRACT']]),
        })
      ).toEqual(['CUSTOM_SUBTRACT', 10, 20])
    })

    it('should throw if operator symbol is not mapped', () => {
      expect(() =>
        new Subtract(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map<symbol, string>(),
        })
      ).toThrow()
    })
  })
})
