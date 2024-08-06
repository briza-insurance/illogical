import { operand } from '../../../__test__/helpers'
import { Sum } from '../../../expression/arithmetic/sum'
import { Value } from '../../../operand/value'
import { Evaluable, Result } from '../../evaluable'
import {
  areAllNumbers,
  areAllResults,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '../../type-check'

describe('Common - Type Check', () => {
  describe('isNumber', () => {
    test.each([
      // Truthy
      [1, true],
      [1.0, true],
      [Infinity, true],
      [-Infinity, true],
      [NaN, true],
      // Falsy
      ['1', false],
      [true, false],
      [false, false],
      [{}, false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [() => {}, false],
    ])('%p should evaluate as %p', (value, expected) => {
      // @ts-ignore
      expect(isNumber(value)).toBe(expected)
    })
  })

  describe('isString', () => {
    test.each([
      // Truthy
      ['1', true],
      [new String('1'), true],
      // Falsy
      [1, false],
      [true, false],
      [false, false],
      [{}, false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [() => {}, false],
    ])('%p should evaluate as %p', (value, expected) => {
      // @ts-ignore
      expect(isString(value)).toBe(expected)
    })
  })

  describe('isObject', () => {
    test.each([
      // Truthy
      [{}, true],
      // Falsy
      ['hi', false],
      [1, false],
      [null, false],
      [undefined, false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isObject(value)).toBe(expected)
    })
  })

  describe('isBoolean', () => {
    test.each([
      // Truthy
      [true, true],
      [false, true],
      // Falsy
      [{}, false],
      ['hi', false],
      [1, false],
      [null, false],
      [undefined, false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isBoolean(value)).toBe(expected)
    })
  })

  describe('areAllResults', () => {
    test.each<[(Result | Evaluable)[], boolean]>([
      // Truthy
      [[1, 2, 3], true],
      [[1, '2', 3], true],
      [[1, 2, {}], true],
      [[1, 2, '3'], true],
      [[1, 2, '3', ['+', 1, 1]], true],
      // Falsy
      [[1, 2, '3', operand(1)], false],
      [[1, 2, '3', new Sum(new Value(1), new Value(2))], false],
    ])('if %p should evaluate as %p', (values, expectedResult) => {
      const result = areAllResults(values)
      expect(result).toEqual(expectedResult)
    })
  })
  describe('areAllNumbers', () => {
    test.each<[Result[], boolean]>([
      // Truthy
      [[1, 2, 3], true],
      // Falsy
      [[1, '2', 3], false],
      [[1, 2, {}], false],
      [[1, 2, '3'], false],
    ])('if %p should evaluate as %p', (values, expectedResult) => {
      const result = areAllNumbers(values)
      expect(result).toEqual(expectedResult)
    })
  })
})
