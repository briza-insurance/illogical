import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Result } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { defaultOptions } from '../../../../parser/options.js'
import { OPERATOR, Subtract } from '../../subtract.js'

describe('Expression - Arithmetic - Subtract', () => {
  describe('constructor', () => {
    const constructorData: Operand[][] = [[], [operand(5)]]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(
          () => new Subtract(...args),
          /subtract expression requires at least 2 operands/
        )
      })
    }
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
    ['2025-12-27', operand('2026-01-01'), operand('5d')],
    ['2010-02-28', operand('2010-03-31'), operand('1m')],
    ['2023-02-28', operand('2024-02-29'), operand('1y')],
    ['2023-01-28', operand('2024-02-29'), operand('1y'), operand('1m')],
    [false, operand(null), operand(1)],
    [false, operand(undefined), operand(1)],
  ]

  describe('evaluate', () => {
    for (const [expected, ...operands] of testCases) {
      test(`that ${expected} is the result of subtracting ${operands}`, () => {
        assert.strictEqual(new Subtract(...operands).evaluate({}), expected)
      })
    }
  })

  describe('evaluate - failure', () => {
    const failureData: [...Operand[]][] = [
      [operand('string1'), operand(2)],
      [operand('string1'), operand('string2')],
      [operand(1), operand('string2')],
      [operand('2024-02-29'), operand(1)],
      [operand(1), operand('2024-02-29')],
      [operand('2024-02'), operand(1)],
      [operand('2024-02'), operand('1dd')],
    ]
    for (const operands of failureData) {
      it(`${operands[0]} and ${operands[1]} should throw`, () => {
        assert.throws(
          () => new Subtract(...operands).evaluate({}),
          /operands must be numbers for Subtract/
        )
      })
    }
  })

  describe('toString', () => {
    const toStringData: [string, ...Value[]][] = [
      ['(5 - 6)', new Value(5), new Value(6)],
      [
        '(1 - 2 - 3 - 4)',
        new Value(1),
        new Value(2),
        new Value(3),
        new Value(4),
      ],
      ['(5 - -6)', new Value(5), new Value(-6)],
      ['("2025-01-31" - "3 days")', new Value('2025-01-31'), new Value('3d')],
      ['("2025-01-31" - "2 months")', new Value('2025-01-31'), new Value('2m')],
      [
        '("2025-01-31" - "1 year" - "2 months" - "3 days")',
        new Value('2025-01-31'),
        new Value('1y'),
        new Value('2m'),
        new Value('3d'),
      ],
    ]
    for (const [expectedResult, ...values] of toStringData) {
      it(`should stringify into ${expectedResult}`, () => {
        const result = new Subtract(...values).toString()
        assert.strictEqual(result, expectedResult)
      })
    }
  })

  describe('simplify', () => {
    const simplifyData: [Result | 'self', ...Operand[]][] = [
      ['self', operand(10), notSimplified()],
      ['self', notSimplified(), operand(10)],
      ['self', notSimplified(), notSimplified()],
      ...testCases,
    ]
    for (const [expected, ...operands] of simplifyData) {
      test(`if ${expected} is the simplification of ${operands}`, () => {
        const sum = new Subtract(...operands)
        const result = sum.simplify({}, new Set([]))
        if (expected === 'self') {
          assert.strictEqual(result, sum)
        } else {
          assert.deepStrictEqual(result, expected)
        }
      })
    }
  })

  describe('serialize', () => {
    it('10 and 20 should be serialized to ["CUSTOM_SUBTRACT", 10, 20]', () => {
      assert.deepStrictEqual(
        new Subtract(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_SUBTRACT']]),
        }),
        ['CUSTOM_SUBTRACT', 10, 20]
      )
    })

    it('2025-01-01, 2d and 2y should be serialized to ["CUSTOM_SUM", "2025-01-01", "2d", "2y"]', () => {
      assert.deepStrictEqual(
        new Subtract(
          new Value('2025-01-01'),
          new Value('2d'),
          new Value('2y')
        ).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_SUBTRACT']]),
        }),
        ['CUSTOM_SUBTRACT', '2025-01-01', '2d', '2y']
      )
    })

    it('should throw if operator symbol is not mapped', () => {
      assert.throws(() =>
        new Subtract(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map<symbol, string>(),
        })
      )
    })
  })
})
