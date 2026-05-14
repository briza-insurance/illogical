import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { defaultOptions } from '../../../parser/options.js'
import { Collection } from '../../collection.js'
import { Reference } from '../../reference.js'
import { Value } from '../../value.js'

describe('Operand - Collection', () => {
  describe('evaluate', () => {
    const evaluateData: [(Value | Reference)[], unknown][] = [
      [[new Value(1)], [1]],
      [[new Value('1')], ['1']],
      [[new Value(true)], [true]],
      [[new Reference('RefA')], ['A']],
      [
        [new Value(1), new Reference('RefA')],
        [1, 'A'],
      ],
    ]
    for (const [value, expected] of evaluateData) {
      test(`${value} should evaluate as ${expected}`, () => {
        assert.deepStrictEqual(
          new Collection(value).evaluate({
            RefA: 'A',
          }),
          expected
        )
      })
    }

    const evaluateThrowData = [[1], ['1'], [true], [undefined], [null]]
    for (const value of evaluateThrowData) {
      test(`${value} should throw`, () => {
        // @ts-ignore intentionally passing invalid types to test runtime error
        assert.throws(() => new Collection(value).evaluate({}))
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [(Value | Reference)[], 'self' | unknown[]][] = [
      [[new Reference('test'), new Value(10)], 'self'],
      [
        [new Reference('refA'), new Value(10)],
        [20, 10],
      ],
      [
        [new Value(20), new Value(10)],
        [20, 10],
      ],
    ]
    for (const [value, expected] of simplifyData) {
      test(`${value} should simplify to ${expected}`, () => {
        const collection = new Collection(value)
        const result = collection.simplify({ refA: 20 }, new Set([]))
        if (expected === 'self') {
          assert.strictEqual(result, collection)
        } else {
          assert.deepStrictEqual(result, expected)
        }
      })
    }
  })

  describe('serialize', () => {
    const serializeData: [(Value | Reference)[], (number | string)[]][] = [
      [
        [new Reference('test'), new Value(10)],
        ['$test', 10],
      ],
      [
        [new Reference('refA'), new Value(10)],
        ['$refA', 10],
      ],
      [
        [new Reference('refA'), new Value('testing')],
        ['$refA', 'testing'],
      ],
      [
        [new Value(20), new Value(10)],
        [20, 10],
      ],
    ]
    for (const [value, expected] of serializeData) {
      test(`${value} should serialize to ${expected}`, () => {
        assert.deepStrictEqual(
          new Collection(value).serialize(defaultOptions),
          expected
        )
      })
    }
  })

  describe('toString', () => {
    const toStringData: [(Value | Reference)[], string][] = [
      [[new Value(1)], '[1]'],
      [[new Value('1')], '["1"]'],
      [[new Value(true)], '[true]'],
      [[new Reference('RefA')], '[{RefA}]'],
      [[new Value(1), new Reference('RefA')], '[1, {RefA}]'],
    ]
    for (const [value, expected] of toStringData) {
      test(`${value} should be ${expected}`, () => {
        assert.strictEqual(new Collection(value).toString(), expected)
      })
    }
  })
})
