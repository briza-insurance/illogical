import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { operand } from '../../../__test__/helpers.js'
import { Sum } from '../../../expression/arithmetic/sum.js'
import { Value } from '../../../operand/value.js'
import { Evaluable, Result } from '../../evaluable.js'
import {
  areAllNumbers,
  areAllResults,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '../../type-check.js'

describe('Common - Type Check', () => {
  describe('isNumber', () => {
    const isNumberData = [
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
      [() => {}, false],
    ]
    for (const [value, expected] of isNumberData) {
      test(`${value} should evaluate as ${expected}`, () => {
        // @ts-ignore
        assert.strictEqual(isNumber(value), expected)
      })
    }
  })

  describe('isString', () => {
    const isStringData = [
      // Truthy
      ['1', true],
      [new String('1'), true],
      // Falsy
      [1, false],
      [true, false],
      [false, false],
      [{}, false],
      [() => {}, false],
    ]
    for (const [value, expected] of isStringData) {
      test(`${value} should evaluate as ${expected}`, () => {
        // @ts-ignore
        assert.strictEqual(isString(value), expected)
      })
    }
  })

  describe('isObject', () => {
    const isObjectData = [
      // Truthy
      [{}, true],
      // Falsy
      ['hi', false],
      [1, false],
      [null, false],
      [undefined, false],
    ]
    for (const [value, expected] of isObjectData) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(isObject(value), expected)
      })
    }
  })

  describe('isBoolean', () => {
    const isBooleanData = [
      // Truthy
      [true, true],
      [false, true],
      // Falsy
      [{}, false],
      ['hi', false],
      [1, false],
      [null, false],
      [undefined, false],
    ]
    for (const [value, expected] of isBooleanData) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(isBoolean(value), expected)
      })
    }
  })

  describe('areAllResults', () => {
    const areAllResultsData: [(Result | Evaluable)[], boolean][] = [
      // Truthy
      [[1, 2, 3], true],
      [[1, '2', 3], true],
      [[1, 2, {}], true],
      [[1, 2, '3'], true],
      [[1, 2, '3', ['+', 1, 1]], true],
      // Falsy
      [[1, 2, '3', operand(1)], false],
      [[1, 2, '3', new Sum(new Value(1), new Value(2))], false],
    ]
    for (const [values, expectedResult] of areAllResultsData) {
      test(`if ${JSON.stringify(values)} should evaluate as ${expectedResult}`, () => {
        const result = areAllResults(values)
        assert.deepStrictEqual(result, expectedResult)
      })
    }
  })
  describe('areAllNumbers', () => {
    const areAllNumbersData: [Result[], boolean][] = [
      // Truthy
      [[1, 2, 3], true],
      // Falsy
      [[1, '2', 3], false],
      [[1, 2, {}], false],
      [[1, 2, '3'], false],
    ]
    for (const [values, expectedResult] of areAllNumbersData) {
      test(`if ${JSON.stringify(values)} should evaluate as ${expectedResult}`, () => {
        const result = areAllNumbers(values)
        assert.deepStrictEqual(result, expectedResult)
      })
    }
  })
})
