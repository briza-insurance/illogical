import { notSimplified, operand } from '../../../../__test__/helpers'
import { Result } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Value } from '../../../../operand/value'
import { defaultOptions } from '../../../../parser/options'
import { Multiply, OPERATOR } from '../../multiply'

describe('Expression - Arithmetic - Multiply', () => {
  describe('constructor', () => {
    test.each([[[]], [[operand(5)]]])('arguments %p should throw', (args) => {
      expect(() => new Multiply(...args)).toThrow(
        'multiply expression requires at least 2 operands'
      )
    })
  })

  const testCases: [Result, ...Operand[]][] = [
    [200, operand(20), operand(10)],
    [6000, operand(10), operand(20), operand(30)],
    [-200, operand(10), operand(-20)],
    [-200, operand(-10), operand(20)],
    [200, operand(-10), operand(-20)],
    [0, operand(10), operand(0)],
    [0, operand(0), operand(-10)],
    [0, operand(0), operand(0)],
    [3.36, operand(2.8), operand(1.2)],
    [2.592591962963, operand(2.333333), operand(1.111111)],
    [0.04, operand(0.4), operand(0.1)],
    [1.776889, operand(1.333), operand(1.333)],
    [false, operand(null), operand(1)],
    [false, operand(undefined), operand(1)],
  ]

  describe('evaluate', () => {
    test.each(testCases)(
      'that %p is the result of multiplying %p',
      (expected, ...operands) => {
        expect(new Multiply(...operands).evaluate({})).toBe(expected)
      }
    )
  })

  describe('evaluate - failure', () => {
    it.each<[...Operand[]]>([
      [operand('string1'), operand(2)],
      [operand('string1'), operand('string2')],
      [operand(1), operand('string2')],
    ])('%p and %p should throw', (...operands) => {
      expect(() => new Multiply(...operands).evaluate({})).toThrow(
        'operands must be numbers for Multiply'
      )
    })
  })

  describe('toString', () => {
    it.each<[string, ...Value[]]>([
      ['(5 * 6)', new Value(5), new Value(6)],
      [
        '(1 * 2 * 3 * 4)',
        new Value(1),
        new Value(2),
        new Value(3),
        new Value(4),
      ],
      ['(5 * -6)', new Value(5), new Value(-6)],
    ])('should stringify into %p', (expectedResult, ...values) => {
      const result = new Multiply(...values).toString()
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
      const mult = new Multiply(...operands)
      const result = mult.simplify({}, [])
      if (expected === 'self') {
        expect(result).toBe(mult)
      } else {
        expect(result).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    it('%p and %p should be serialized to %p', () => {
      expect(
        new Multiply(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_MULT']]),
        })
      ).toEqual(['CUSTOM_MULT', 10, 20])
    })

    it('should throw if operator symbol is not mapped', () => {
      expect(() =>
        new Multiply(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map<symbol, string>(),
        })
      ).toThrow()
    })
  })
})
