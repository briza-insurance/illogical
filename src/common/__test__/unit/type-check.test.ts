import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { isBoolean, isNumber, isObject, isString } from '../../type-check.js'

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
})
