import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Result } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Value } from '../../../../operand/value.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Divide, OPERATOR } from '../../divide.js'

describe('Expression - Arithmetic - Divide', () => {
  describe('constructor', () => {
    const constructorData = [[[]], [[operand(5)]]]
    for (const args of constructorData) {
      test(`arguments ${JSON.stringify(args)} should throw`, () => {
        assert.throws(
          () => new Divide(...(args as Operand[])),
          /divide expression requires at least 2 operands/
        )
      })
    }
  })

  const testCases: [Result, ...Operand[]][] = [
    [2, operand(20), operand(10)],
    [0.016666666666666666, operand(10), operand(20), operand(30)],
    [-0.5, operand(10), operand(-20)],
    [-0.5, operand(-10), operand(20)],
    [0.5, operand(-10), operand(-20)],
    [Infinity, operand(10), operand(0)],
    [-0, operand(0), operand(-10)],
    [NaN, operand(0), operand(0)],
    [2.3333333333333335, operand(2.8), operand(1.2)],
    [2.0999999099999913, operand(2.333333), operand(1.111111)],
    [4, operand(0.4), operand(0.1)],
    [1, operand(1.333), operand(1.333)],
    [false, operand(null), operand(1)],
    [false, operand(undefined), operand(1)],
  ]

  describe('evaluate', () => {
    for (const [expected, ...operands] of testCases) {
      test(`that ${expected} is the result of dividing ${operands}`, () => {
        assert.strictEqual(new Divide(...operands).evaluate({}), expected)
      })
    }
  })

  describe('evaluate - failure', () => {
    const failureData: [...Operand[]][] = [
      [operand('string1'), operand(2)],
      [operand('string1'), operand('string2')],
      [operand(1), operand('string2')],
    ]
    for (const operands of failureData) {
      it(`${operands[0]} and ${operands[1]} should throw`, () => {
        assert.throws(
          () => new Divide(...operands).evaluate({}),
          /operands must be numbers for Divide/
        )
      })
    }
  })

  describe('toString', () => {
    const toStringData: [string, ...Value[]][] = [
      ['(5 / 6)', new Value(5), new Value(6)],
      [
        '(1 / 2 / 3 / 4)',
        new Value(1),
        new Value(2),
        new Value(3),
        new Value(4),
      ],
      ['(5 / -6)', new Value(5), new Value(-6)],
    ]
    for (const [expectedResult, ...values] of toStringData) {
      it(`should stringify into ${expectedResult}`, () => {
        const result = new Divide(...values).toString()
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
        const division = new Divide(...operands)
        const result = division.simplify({}, new Set([]))
        if (expected === 'self') {
          assert.strictEqual(result, division)
        } else {
          assert.deepStrictEqual(result, expected)
        }
      })
    }
  })

  describe('serialize', () => {
    it('10 and 20 should be serialized to ["CUSTOM_DIVIDE", 10, 20]', () => {
      assert.deepStrictEqual(
        new Divide(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map([[OPERATOR, 'CUSTOM_DIVIDE']]),
        }),
        ['CUSTOM_DIVIDE', 10, 20]
      )
    })

    it('should throw if operator symbol is not mapped', () => {
      assert.throws(() =>
        new Divide(new Value(10), new Value(20)).serialize({
          ...defaultOptions,
          operatorMapping: new Map<symbol, string>(),
        })
      )
    })
  })
})
