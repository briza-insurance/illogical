import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { Result } from '../../../common/evaluable.js'
import { Value } from '../../value.js'

describe('Operand - Value', () => {
  describe('constructor', () => {
    const constructorData = [[[1, '2', true]]]
    for (const value of constructorData) {
      test(`arguments ${value} should throw`, () => {
        assert.throws(() => new Value(value as unknown as Result))
      })
    }
  })

  const testCases: [Result, Result][] = [
    [1, 1],
    ['1', '1'],
    [true, true],
    [undefined, undefined],
    [null, null],
  ]

  describe('evaluate', () => {
    for (const [value, expected] of testCases) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Value(value).evaluate(), expected)
      })
    }
  })

  describe('simplify', () => {
    for (const [value, expected] of testCases) {
      test(`${value} should simplify to ${expected}`, () => {
        assert.strictEqual(new Value(value).simplify(), expected)
      })
    }
  })

  describe('serialize', () => {
    for (const [value, expected] of testCases) {
      test(`${value} should simplify to ${expected}`, () => {
        assert.strictEqual(new Value(value).serialize(), expected)
      })
    }
  })

  describe('toString', () => {
    const toStringData = [
      [1, '1'],
      ['1', '"1"'],
      [true, 'true'],
      [undefined, 'undefined'],
      [null, 'null'],
    ]
    for (const [value, expected] of toStringData) {
      test(`${value} should be ${expected}`, () => {
        assert.strictEqual(new Value(value as Result).toString(), expected)
      })
    }
  })
})
