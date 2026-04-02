import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Collection } from '../../../../operand/collection.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { NotIn } from '../../not-in.js'

describe('Expression - Comparison - Not In', () => {
  describe('constructor', () => {
    const constructorData = [
      [[]],
      [[operand(5)]],
      [[operand(5), operand(5), operand(5)]],
    ]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(() => new NotIn(...(args as Operand[])))
      })
    }
  })

  const testCases: [Operand, Operand, boolean][] = [
    // Truthy
    [operand(0), new Collection([new Value(1), new Value(2)]), true],
    [operand('0'), new Collection([new Value('1'), new Value('2')]), true],
    [operand(true), new Collection([new Value(false), new Value(false)]), true],
    // Truthy - Bi-directional
    [new Collection([new Value(1), new Value(2)]), new Value(0), true],
    [new Collection([new Value('1'), new Value('2')]), new Value('0'), true],
    [
      new Collection([new Value(false), new Value(false)]),
      new Value(true),
      true,
    ],
    // Truthy - non-comparable types
    [operand('0'), new Collection([new Value(0), new Value(1)]), true],
    [operand(0), new Collection([new Value('0'), new Value('1')]), true],
    // Falsy
    [operand(1), new Collection([new Value(1), new Value(2)]), false],
    [operand('1'), new Collection([new Value('1'), new Value('2')]), false],
    [
      operand(false),
      new Collection([new Value(false), new Value(false)]),
      false,
    ],
  ]

  describe('evaluate', () => {
    for (const [left, right, expected] of testCases) {
      test(`${left} and ${right} should evaluate as ${expected}`, () => {
        assert.strictEqual(new NotIn(left, right).evaluate({}), expected)
      })
    }

    const evaluateThrowData = [
      // Missing haystack
      [operand(1), operand(1)],
      // Double haystack
      [new Collection([new Value(1)]), new Collection([new Value(1)])],
    ]
    for (const [left, right] of evaluateThrowData) {
      test(`${left} and ${right} should throw`, () => {
        assert.throws(() =>
          new NotIn(left as Evaluable, right as Evaluable).evaluate({})
        )
      })
    }
  })

  describe('toString', () => {
    const toStringData: [Evaluable, Evaluable, string][] = [
      [
        new Value(0),
        new Collection([new Value(1), new Value(2)]),
        '(0 not in [1, 2])',
      ],
      [
        new Collection([new Value(1), new Value(2)]),
        new Value(0),
        '(0 not in [1, 2])',
      ],
    ]
    for (const [left, right, expected] of toStringData) {
      test(`${left} and ${right} should be ${expected}`, () => {
        assert.strictEqual(new NotIn(left, right).toString(), expected)
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
        const equal = new NotIn(left, right)
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
          new NotIn(left, right).serialize(defaultOptions),
          ['NOT IN', ...serialized]
        )
      })
    }
  })
})
