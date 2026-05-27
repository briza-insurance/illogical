import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { toDateDuration, toDateNumber, toNumber, toString } from '../../util.js'

describe('Util', () => {
  describe('toNumber', () => {
    const cases = [
      // Truthy
      ['1.1', 1.1],
      ['100.989', 100.989],
      ['0.9991', 0.9991],
      ['100.00', 100],
      ['0.000', 0],
      // Falsy
      ['.000', undefined],
      ['100.abc', undefined],
      ['Infinity', undefined],
      [null, undefined],
      [undefined, undefined],
      [[], undefined],
      [{}, undefined],
    ]
    for (const [value, expected] of cases) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(toNumber(value), expected)
      })
    }
  })

  describe('toString', () => {
    const cases = [
      // Truthy
      [1.1, '1.1'],
      [100.989, '100.989'],
      ['100.989', '100.989'],
      ['abc', 'abc'],
      // Falsy
      [null, undefined],
      [undefined, undefined],
      [[], undefined],
      [{}, undefined],
    ]
    for (const [value, expected] of cases) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(toString(value), expected)
      })
    }
  })

  describe('toDateNumber', () => {
    const cases = [
      // Truthy
      ['2010-01-01', 1262304000000],
      // Falsy
      ['2010-13-01', NaN],
      ['2010-09-32', NaN],
      ['20-09-01', NaN],
      [null, NaN],
      [undefined, NaN],
      [[], NaN],
      [{}, NaN],
    ]
    for (const [value, expected] of cases) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(toDateNumber(value), expected)
      })
    }
  })

  describe('toDateNumber', () => {
    const cases = [
      // Truthy
      ['2010-01-01', 1262304000000],
      // Falsy
      ['2010-13-01', NaN],
      ['2010-09-32', NaN],
      ['20-09-01', NaN],
      [null, NaN],
      [undefined, NaN],
      [[], NaN],
      [{}, NaN],
    ]
    for (const [value, expected] of cases) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(toDateNumber(value), expected)
      })
    }
  })

  describe('toDateDuration', () => {
    const cases = [
      // Truthy
      [
        '1d',
        {
          amount: 1,
          unit: 'd',
        },
      ],
      [
        '2m',
        {
          amount: 2,
          unit: 'm',
        },
      ],
      [
        '3y',
        {
          amount: 3,
          unit: 'y',
        },
      ],
      // Falsy
      ['1', undefined],
      [1, undefined],
      ['0d', undefined],
      ['0m', undefined],
      ['0y', undefined],
      [null, undefined],
      [undefined, undefined],
      [[], undefined],
      [{}, undefined],
    ]
    for (const [value, expected] of cases) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(
          JSON.stringify(toDateDuration(value)),
          JSON.stringify(expected)
        )
      })
    }
  })
})
