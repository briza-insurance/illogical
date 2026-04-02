import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Suffix } from '../../suffix.js'

describe('Expression - Comparison - Suffix', () => {
  describe('constructor', () => {
    const constructorData = [
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]],
    ]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new Suffix(...(args as Operand[])))
      })
    }
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand('abc'), operand('c'), true],
    [operand('a'), operand('a'), true],
    // Falsy
    [operand('abc'), operand('a'), false],
    [operand(''), operand('a'), false],
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
    for (const [left, right, expected] of testCases) {
      test(`${left} and ${right} should evaluate as ${expected}`, () => {
        assert.strictEqual(new Suffix(left, right).evaluate({}), expected)
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Operand, Operand, boolean | 'self'][] = [
      [operand(10), notSimplified(), 'self'],
      [notSimplified(), operand(10), 'self'],
      [notSimplified(), notSimplified(), 'self'],
      ...testCases,
    ]
    for (const [left, right, expected] of simplifyData) {
      test(`${left} and ${right} should be simplified to ${expected}`, () => {
        const equal = new Suffix(left, right)
        const result = equal.simplify({}, new Set([]))
        if (expected === 'self') {
          assert.strictEqual(result, equal)
        } else {
          assert.deepStrictEqual(result, expected)
        }
      })
    }
  })

  describe('serialize', () => {
    const serializeData: [Operand, Operand, [Input, Input]][] = [
      [new Value(10), new Value(20), [10, 20]],
    ]
    for (const [left, right, serialized] of serializeData) {
      it(`${left} and ${right} should be serialized to ${serialized}`, () => {
        assert.deepStrictEqual(
          new Suffix(left, right).serialize(defaultOptions),
          ['SUFFIX', ...serialized]
        )
      })
    }
  })
})
