import { strict as assert } from 'node:assert'
import { describe, it, test } from 'node:test'

import { Context } from '../../common/evaluable.js'
import { OPERATOR as OPERATOR_SUM } from '../../expression/arithmetic/sum.js'
import { OPERATOR as OPERATOR_EQ } from '../../expression/comparison/eq.js'
import { OPERATOR as OPERATOR_GE } from '../../expression/comparison/ge.js'
import { OPERATOR as OPERATOR_GT } from '../../expression/comparison/gt.js'
import { OPERATOR as OPERATOR_IN } from '../../expression/comparison/in.js'
import { OPERATOR as OPERATOR_LE } from '../../expression/comparison/le.js'
import { OPERATOR as OPERATOR_LT } from '../../expression/comparison/lt.js'
import { OPERATOR as OPERATOR_NE } from '../../expression/comparison/ne.js'
import { OPERATOR as OPERATOR_NOT_IN } from '../../expression/comparison/not-in.js'
import { OPERATOR as OPERATOR_PREFIX } from '../../expression/comparison/prefix.js'
import { OPERATOR as OPERATOR_SUFFIX } from '../../expression/comparison/suffix.js'
import { OPERATOR as OPERATOR_AND } from '../../expression/logical/and.js'
import { OPERATOR as OPERATOR_NOR } from '../../expression/logical/nor.js'
import { OPERATOR as OPERATOR_OR } from '../../expression/logical/or.js'
import { OPERATOR as OPERATOR_XOR } from '../../expression/logical/xor.js'
import Engine from '../../index.js'
import { ExpressionInput, Input } from '../../parser/index.js'

for (const evaluator of ['oop', 'bytecode'] as const) {
  describe(`Condition Engine [${evaluator}]`, () => {
    const engine = new Engine({ evaluator })

    describe('evaluate', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const evaluateData1 = [
        // OVERLAP
        ...[
          [
            'OVERLAP',
            ['$State1', '$State2', '$State3', '$State4'],
            ['TX', 'CA'],
          ],
        ].map((expression) => [
          [expression, { State1: 'TX' }, true],
          [expression, { State1: 'AL' }, false],
          [
            expression,
            { State1: 'TX', State2: 'AL', State3: 'CA', State4: 'CO' },
            true,
          ],
          [
            expression,
            { State1: 'MI', State2: 'RI', State3: 'NY', State4: 'NY' },
            false,
          ],
        ]),
        // UNDEFINED
        ...[['UNDEFINED', '$Name']].map((expression) => [
          [expression, { Name: undefined }, true],
          [expression, { Name: 'David' }, false],
          [expression, { Name: null }, false],
        ]),
        // PRESENT
        ...[['PRESENT', '$Name']].map((expression) => [
          [expression, { Name: undefined }, false],
          [expression, { Name: 'David' }, true],
          [expression, { Name: null }, false],
          [expression, { Name: false }, true],
          [expression, { Name: { obj: 'obj' } }, true],
        ]),
        // NOT UNDEFINED
        ...[['NOT', ['UNDEFINED', '$Name']]].map((expression) => [
          [expression, { Name: undefined }, false],
          [expression, { Name: 'David' }, true],
          [expression, { Name: null }, true],
        ]),
        // NOT OVERLAP
        ...[
          [
            'NOT',
            [
              'OVERLAP',
              ['$region1', '$region2'],
              ['FL', 'LA', 'NY', 'RI', 'TX'],
            ],
          ],
        ].map((expression) => [
          [expression, { region1: 'FL', region2: 'MI' }, false],
          [expression, { region1: 'AL', region2: 'MI' }, true],
        ]),
      ].flat() as [ExpressionInput, Context, boolean][]

      for (const [expression, context, expected] of evaluateData1) {
        test(`${JSON.stringify(expression)} in ${JSON.stringify(
          context
        )} should evaluate as ${expected}`, () => {
          assert.deepStrictEqual(engine.evaluate(expression, context), expected)
        })
      }

      const evaluateData2: [ExpressionInput, Context, boolean][] = [
        [['==', ['+', 5, 5, 5], 15], {}, true],
        [['==', ['+', '$RefA', 5], 15], {}, false],
        [['==', ['+', '$RefA', 5], 15], { RefA: 10 }, true],
        [['==', ['+', '$RefA', 5], 15], { RefA: 0 }, false],
        [['>', ['-', '$RefA', 5], 15], {}, false],
        [['>', '$RefA', 15], {}, false],
        [['IN', '$RefA', ['option1', 'option2']], {}, false],
        [['OVERLAP', ['$RefA', '$RefB'], ['option1', 'option2']], {}, false],
        [['PRESENT', '$RefA'], {}, false],
        [['UNDEFINED', '$RefA'], {}, true],
        [
          ['AND', ['UNDEFINED', '$RefA'], ['PRESENT', '$RefB']],
          { RefB: 'present' },
          true,
        ],
        [['OR', ['UNDEFINED', '$RefA'], ['PRESENT', '$RefB']], {}, true],
      ]

      for (const [expression, context, expectedResult] of evaluateData2) {
        test(`${JSON.stringify(
          expression
        )} should evaluate to ${expectedResult}`, () => {
          assert.deepStrictEqual(
            engine.evaluate(expression, context),
            expectedResult
          )
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const evaluateThrowData = [
        // Operators with invalid operands
        [[OPERATOR_EQ]],
        [[OPERATOR_EQ, 5]],
        [[OPERATOR_EQ, 5, 5, 5]],
        [[OPERATOR_NE]],
        [[OPERATOR_GT]],
        [[OPERATOR_GE]],
        [[OPERATOR_LT]],
        [[OPERATOR_LE]],
        [[OPERATOR_IN]],
        [[OPERATOR_NOT_IN]],
        [[OPERATOR_PREFIX]],
        [[OPERATOR_SUFFIX]],
        [[OPERATOR_AND]],
        [[OPERATOR_OR]],
        [[OPERATOR_NOR]],
        [[OPERATOR_XOR]],
        [[OPERATOR_SUM]],
        [[OPERATOR_SUM, 5, 5, 5]],
      ] as unknown as [ExpressionInput][]

      for (const [expression] of evaluateThrowData) {
        test(`${JSON.stringify(expression)} should throw`, () => {
          assert.throws(() => engine.evaluate(expression, {}))
        })
      }

      const evaluateInvalidExpressionData: [ExpressionInput][] = [
        [['+', 5, 5]],
        [['-', 5, 5]],
        [['*', 5, 5]],
        [['/', 5, 5]],
      ]

      for (const [expression] of evaluateInvalidExpressionData) {
        test(`${JSON.stringify(expression)} should throw`, () => {
          assert.throws(
            () => engine.evaluate(expression, {}),
            /invalid expression/
          )
        })
      }
    })

    test('statement', () => {
      const exceptions: { expression: ExpressionInput }[] = [
        { expression: ['=='] },
        { expression: ['==', 5] },
        { expression: ['==', 5, 5, 5] },
        { expression: ['!='] },
        { expression: ['>'] },
        { expression: ['>='] },
        { expression: ['<'] },
        { expression: ['<='] },
        { expression: ['IN'] },
        { expression: ['NOT IN'] },
        { expression: ['PREFIX'] },
        { expression: ['SUFFIX'] },
        { expression: ['NOR', ['==', '$x', 1]] },
        { expression: ['XOR', ['==', '$x', 1]] },
      ]

      for (const exception of exceptions) {
        assert.throws(() => engine.statement(exception.expression))
      }
    })

    describe('parse', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const parseThrowData = [
        // Operators with invalid operands
        [[OPERATOR_EQ]],
        [[OPERATOR_EQ, 5]],
        [[OPERATOR_EQ, 5, 5, 5]],
        [[OPERATOR_NE]],
        [[OPERATOR_GT]],
        [[OPERATOR_GE]],
        [[OPERATOR_LT]],
        [[OPERATOR_LE]],
        [[OPERATOR_IN]],
        [[OPERATOR_NOT_IN]],
        [[OPERATOR_PREFIX]],
        [[OPERATOR_SUFFIX]],
        [[OPERATOR_AND]],
        [[OPERATOR_OR]],
        [[OPERATOR_NOR]],
        [[OPERATOR_XOR]],
        [[OPERATOR_SUM]],
      ] as unknown as [ExpressionInput][]

      for (const [expression] of parseThrowData) {
        test(`${JSON.stringify(expression)} should throw`, () => {
          assert.throws(() => engine.parse(expression))
        })
      }
    })

    describe('simplify', () => {
      const simplifyData: [
        exp: ExpressionInput,
        ctx: Context,
        expected: boolean | Input,
        strictKeys?: string[],
        optionalKeys?: string[],
      ][] = [
        [['==', '$a', '$b'], { a: 10, b: 20 }, false, []],
        [['==', '$a', '$b'], { a: 10 }, ['==', '$a', '$b'], []],
        [['==', '$a', '$b'], { a: 10, b: 10 }, true, []],
        [
          ['AND', ['==', '$a', '$b'], ['==', '$c', '$d']],
          { a: 10, b: 10 },
          ['==', '$c', '$d'],
          [],
        ],
        [
          ['AND', ['==', '$a', '$e'], ['==', '$c', '$d']],
          { a: 10, b: 10 },
          ['AND', ['==', '$a', '$e'], ['==', '$c', '$d']],
          [],
        ],
        [
          ['AND', ['==', '$a', '$e'], ['==', '$c', '$d']],
          { a: 10, b: 10 },
          false,
          ['e'],
        ],
        [
          ['OR', ['==', '$a', '$b'], ['==', '$c', '$d']],
          { a: 10, b: 10 },
          true,
          [],
        ],
        [
          ['OR', ['==', '$a', '$b'], ['==', '$c', '$d']],
          { a: 10, b: 20 },
          true,
          undefined,
          ['e'],
        ],
        [
          ['OR', ['==', '$a', 10], ['==', '$b', 20], ['==', '$c', 20]],
          { c: 10 },
          ['==', '$b', 20],
          undefined,
          ['b'],
        ],
        [['PRESENT', '$a'], { a: { obj: 'obj' } }, true, undefined, []],
        [['==', '$a', null], { a: { obj: 'obj' } }, false, undefined, []],
        [['>', ['+', '$a', 5], 6], { a: 5 }, true],
        [['>', ['+', '$a', 5], 6], { a: -2 }, false],
        [['==', ['+', '$a', 1, 1, 1], 4], { a: 1 }, true],
        [['>', ['-', '$a', 5], 6], { a: 12 }, true],
        [['>', ['-', '$a', 5], 6], { a: 11 }, false],
        [['==', ['-', '$a', 1, 1, 1], 0], { a: 3 }, true],
        [['>', ['*', '$a', 6], 6], { a: 1.1 }, true],
        [['>', ['*', '$a', 5], 6], { a: 1 }, false],
        [['==', ['*', '$a', 1, 2, 3], 30], { a: 5 }, true],
        [['>', ['/', '$a', 6], 6], { a: 42 }, true],
        [['>', ['/', '$a', 5], 6], { a: 30 }, false],
        [['==', ['/', '$a', 3, 2, 1], 15], { a: 90 }, true],
        [['>', ['/', 10, 0], 10000], {}, true], // 10 / 0 = Infinity
        [['>', 10000, ['/', 10, 0]], {}, false], // 10 / 0 = Infinity
        [['>', ['/', 0, 0], 10000], {}, false], // 0 / 0 = NaN
        [
          ['>', ['/', 10, 0], ['+', '$a', 0]],
          { b: 0 },
          ['>', ['/', 10, 0], ['+', '$a', 0]], // Infinity/NaN from arithmetic is preserved (not eagerly evaluated)
        ],
        [
          ['>', ['/', '$a', 0], ['+', 0, 0]],
          { b: 0 },
          ['>', ['/', '$a', 0], 0],
        ],
        [
          ['>', ['+', 0, 0], ['/', '$a', 0]],
          { b: 0 },
          ['>', 0, ['/', '$a', 0]],
        ],
        [['==', ['+', ['*', 9, 9], 19], 100], {}, true],
        [['==', ['+', ['*', 9, 9], ['-', ['/', 250, 5], 31]], 100], {}, true],
        [['AND', ['==', ['+', 1, 1], 2], ['==', ['+', 2, 2], 4]], {}, true],
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          { Ref1: 4 },
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
        ],
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          { Ref1: 1 },
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
        ],
      ]

      for (const [
        exp,
        ctx,
        expected,
        strictKeys,
        optionalKeys,
      ] of simplifyData) {
        test(`${JSON.stringify(exp)} with context ${JSON.stringify(
          ctx
        )} should be simplified to ${JSON.stringify(expected)}`, () => {
          assert.deepStrictEqual(
            engine.simplify(exp, ctx, strictKeys, optionalKeys),
            expected
          )
        })
      }

      const simplifyThrowData: [ExpressionInput][] = [
        [['+', 5, 5]],
        [['-', 5, 5]],
        [['*', 5, 5]],
        [['/', 5, 5]],
        [['+', ['AND', ['==', 1, 1]], 1]],
        [['AND', ['+', 1, -1], ['+', ['-', 1, 1], 1]]],
        [['NOT', ['+', 1, 1]]],
      ]

      for (const [expression] of simplifyThrowData) {
        test(`${JSON.stringify(expression)} should throw`, () => {
          assert.throws(
            () => engine.simplify(expression, {}),
            /invalid expression/
          )
        })
      }
    })

    describe('Extra tests for code coverage', () => {
      const coverageData1: [
        Input,
        ExpressionInput,
        Context,
        string[] | undefined,
        string[] | undefined,
      ][] = [
        // LOGICAL
        // OR
        [
          true,
          ['OR', ['==', '$Ref1', 1], ['==', 1, 1], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          ['OR', ['==', '$Ref1', 1], ['==', '$Ref1', 1]],
          ['OR', ['==', '$Ref1', 1], ['==', 1, 2], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          ['==', '$Ref1', 1],
          ['OR', ['==', 1, 2], ['==', 2, 3], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          true,
          ['OR', ['==', 1, 2], ['==', 2, 3], ['==', '$Ref1', 1]],
          {
            Ref1: 1,
          },
          undefined,
          undefined,
        ],
        [
          false,
          ['OR', ['==', 1, 2], ['==', 2, 3], ['==', '$Ref1', 1]],
          {
            Ref1: 2,
          },
          undefined,
          undefined,
        ],
        // AND
        [
          false,
          ['AND', ['==', '$Ref1', 1], ['==', 1, 2], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          ['AND', ['==', '$Ref1', 1], ['==', '$Ref1', 1]],
          ['AND', ['==', '$Ref1', 1], ['==', 1, 1], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          ['==', '$Ref1', 1],
          ['AND', ['==', 1, 1], ['==', 2, 2], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          true,
          ['AND', ['==', 1, 1], ['==', 2, 2], ['==', '$Ref1', 1]],
          {
            Ref1: 1,
          },
          undefined,
          undefined,
        ],
        [
          false,
          ['AND', ['==', 1, 1], ['==', 2, 2], ['==', '$Ref1', 1]],
          {
            Ref1: 2,
          },
          undefined,
          undefined,
        ],
        // NOR
        [
          ['NOR', ['==', '$Ref1', 1], ['==', '$Ref1', 1]],
          ['NOR', ['==', '$Ref1', 1], ['==', 1, 2], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          false,
          ['NOR', ['==', '$Ref1', 1], ['==', 1, 1], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          ['NOT', ['==', '$Ref1', 1]],
          ['NOR', ['==', 1, 2], ['==', 2, 3], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          true,
          ['NOR', ['==', 1, 2], ['==', 2, 3], ['==', '$Ref1', 1]],
          {
            Ref1: 2,
          },
          undefined,
          undefined,
        ],
        [
          false,
          ['NOR', ['==', 1, 2], ['==', 2, 3], ['==', '$Ref1', 1]],
          {
            Ref1: 1,
          },
          undefined,
          undefined,
        ],
        // XOR
        [
          true,
          ['XOR', ['==', '$Ref1', 1], ['==', 2, 3], ['==', '$Ref1', 2]],
          {
            Ref1: 2,
          },
          undefined,
          undefined,
        ],
        [
          false,
          ['XOR', ['==', '$Ref1', 1], ['==', 2, 3], ['==', '$Ref1', 2]],
          {
            Ref1: 3,
          },
          undefined,
          undefined,
        ],
        [
          ['NOT', ['==', '$Ref1', 1]],
          ['XOR', ['==', '$Ref1', 1], ['==', 1, 2], ['==', 2, 2]],
          {},
          undefined,
          undefined,
        ],
        [
          ['==', '$Ref1', 1],
          ['XOR', ['==', '$Ref1', 1], ['==', 1, 2], ['==', 2, 3]],
          {},
          undefined,
          undefined,
        ],
        [
          ['XOR', ['==', '$Ref1', 1], ['==', '$Ref1', 1]],
          ['XOR', ['==', '$Ref1', 1], ['==', 1, 2], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [
          ['NOR', ['==', '$Ref1', 1], ['==', '$Ref1', 1]],
          ['XOR', ['==', '$Ref1', 1], ['==', 1, 1], ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        [false, ['XOR', ['==', 1, 1], ['==', 2, 2]], {}, undefined, undefined],
        // NOT
        [true, ['NOT', ['==', 1, 2]], {}, undefined, undefined],
        [false, ['NOT', ['==', 1, 1]], {}, undefined, undefined],
        [false, ['NOT', ['==', '$Ref1', 1]], { Ref1: 1 }, undefined, undefined],
        [
          ['NOT', ['==', '$Ref1', 1]],
          ['NOT', ['==', '$Ref1', 1]],
          {},
          undefined,
          undefined,
        ],
        // COMPARISON
        // Eq
        [true, ['==', 1, 1], {}, undefined, undefined],
        [false, ['==', 1, 2], {}, undefined, undefined],
        [true, ['==', '$Ref1', 1], { Ref1: 1 }, undefined, undefined],
        [
          ['==', '$Ref1', '$Ref2'],
          ['==', '$Ref1', '$Ref2'],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [false, ['==', '$Ref1', [1]], { Ref1: 1 }, undefined, undefined],
        // NE
        [false, ['!=', 1, 1], {}, undefined, undefined],
        [true, ['!=', 1, 2], {}, undefined, undefined],
        [false, ['!=', '$Ref1', 1], { Ref1: 1 }, undefined, undefined],
        [
          ['!=', '$Ref1', '$Ref2'],
          ['!=', '$Ref1', '$Ref2'],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          ['!=', '$Ref1', '$Ref2'],
          ['!=', '$Ref1', '$Ref2'],
          { Ref2: 1 },
          undefined,
          undefined,
        ],
        // GT
        [true, ['>', 2, 1], {}, undefined, undefined],
        [false, ['>', 1, 2], {}, undefined, undefined],
        [['>', '$Ref1', 1], ['>', '$Ref1', 1], {}, undefined, undefined],
        [['>', 1, '$Ref1'], ['>', 1, '$Ref1'], {}, undefined, undefined],
        [true, ['>', '$Ref1', 1], { Ref1: 2 }, undefined, undefined],
        [false, ['>', '$Ref1', 1], { Ref1: 1 }, undefined, undefined],
        [
          false,
          ['>', '$Ref1', '2000-01-01'],
          { Ref1: '1990-01-01' },
          undefined,
          undefined,
        ],
        [
          true,
          ['>', '$Ref1', '$Ref2'],
          { Ref1: 2, Ref2: 1 },
          undefined,
          undefined,
        ],
        [false, ['>', '$Ref1', 2], { Ref1: true }, undefined, undefined],
        // GE
        [true, ['>=', 2, 1], {}, undefined, undefined],
        [true, ['>=', 2, 2], {}, undefined, undefined],
        [false, ['>=', 1, 2], {}, undefined, undefined],
        [['>=', '$Ref1', 2], ['>=', '$Ref1', 2], {}, undefined, undefined],
        [['>=', 2, '$Ref1'], ['>=', 2, '$Ref1'], {}, undefined, undefined],
        [
          true,
          ['>=', '$Ref1', '2000-01-01'],
          { Ref1: '2000-01-01' },
          undefined,
          undefined,
        ],
        [false, ['>=', '$Ref1', 2], { Ref1: true }, undefined, undefined],
        // LT
        [true, ['<', 1, 2], {}, undefined, undefined],
        [false, ['<', 2, 1], {}, undefined, undefined],
        [true, ['<', 1, '$Ref1'], { Ref1: 2 }, undefined, undefined],
        [false, ['<', 1, '$Ref1'], { Ref1: 1 }, undefined, undefined],
        [['<', '$Ref1', 2], ['<', '$Ref1', 2], {}, undefined, undefined],
        [['<', 2, '$Ref1'], ['<', 2, '$Ref1'], {}, undefined, undefined],
        [
          false,
          ['<', '$Ref1', '1990-01-01'],
          { Ref1: '2000-01-01' },
          undefined,
          undefined,
        ],
        [
          true,
          ['<', '$Ref1', '$Ref2'],
          { Ref1: 1, Ref2: 2 },
          undefined,
          undefined,
        ],
        [false, ['<', '$Ref1', 2], { Ref1: true }, undefined, undefined],
        // LE
        [true, ['<=', 1, 2], {}, undefined, undefined],
        [true, ['<=', 2, 2], {}, undefined, undefined],
        [false, ['<=', 2, 1], {}, undefined, undefined],
        [['<=', '$Ref1', 2], ['<=', '$Ref1', 2], {}, undefined, undefined],
        [['<=', 2, '$Ref1'], ['<=', 2, '$Ref1'], {}, undefined, undefined],
        [
          false,
          ['<=', '$Ref1', '1990-01-01'],
          { Ref1: '2000-01-01' },
          undefined,
          undefined,
        ],
        [false, ['<=', '$Ref1', 2], { Ref1: true }, undefined, undefined],
        // IN
        [true, ['IN', '$Ref1', [1, 2, 3]], { Ref1: 1 }, undefined, undefined],
        [false, ['IN', '$Ref1', [1, 2, 3]], { Ref1: 4 }, undefined, undefined],
        [true, ['IN', [1, 2, 3], '$Ref1'], { Ref1: 1 }, undefined, undefined],
        [
          ['IN', [1, 2, 3], '$Ref1'],
          ['IN', [1, 2, 3], '$Ref1'],
          {},
          undefined,
          undefined,
        ],
        [
          ['IN', '$Ref1', [1, 2, 3]],
          ['IN', '$Ref1', [1, 2, 3]],
          {},
          undefined,
          undefined,
        ],
        [
          ['IN', 1, ['$Ref1', '$Ref2', '$Ref3']],
          ['IN', 1, ['$Ref1', '$Ref2', '$Ref3']],
          {},
          undefined,
          undefined,
        ],
        [
          ['IN', ['$Ref1', '$Ref2', '$Ref3'], 1],
          ['IN', ['$Ref1', '$Ref2', '$Ref3'], 1],
          {},
          undefined,
          undefined,
        ],
        [
          ['IN', '$Ref1', [1, 2, 3]],
          ['OR', ['==', 1, 2], ['IN', '$Ref1', [1, 2, 3]]],
          {},
          undefined,
          undefined,
        ],
        [
          ['IN', '$Ref1', [1, 2, 3]],
          ['AND', ['==', 1, 1], ['IN', '$Ref1', [1, 2, 3]]],
          {},
          undefined,
          undefined,
        ],
        [false, ['IN', null, [1, 2, 3]], {}, undefined, undefined],
        [
          true,
          ['IN', 1, '$Ref1'],
          { Ref1: [1, undefined, 3] },
          undefined,
          undefined,
        ],
        [
          true,
          ['IN', '$Ref1', 1],
          { Ref1: [1, undefined, 3] },
          undefined,
          undefined,
        ],
        [
          ['IN', '$Ref1', '$Ref2'],
          ['IN', '$Ref1', '$Ref2'],
          { Ref1: [1, undefined, 3] },
          undefined,
          undefined,
        ],
        [
          ['IN', '$Ref1', '$Ref2'],
          ['IN', '$Ref1', '$Ref2'],
          { Ref2: [1, undefined, 3] },
          undefined,
          undefined,
        ],
        [
          false,
          ['IN', '$Ref1', '$Ref2'],
          { Ref1: [1, undefined, 3] },
          ['Ref1', 'Ref2'],
          undefined,
        ],
        [
          true,
          ['IN', '$Ref1', '$Ref2'],
          { Ref1: [1, undefined, 3], Ref2: 1 },
          ['Ref1', 'Ref2'],
          undefined,
        ],
        [
          false,
          ['IN', '$Ref1', '$Ref2'],
          { Ref1: 1, Ref2: null },
          undefined,
          undefined,
        ],
        [false, ['IN', '$Ref1', '$Ref2'], { Ref1: 1 }, ['Ref2'], undefined],
        // NOT_IN
        [
          false,
          ['NOT IN', '$Ref1', [1, 2, 3]],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          true,
          ['NOT IN', '$Ref1', [1, 2, 3]],
          { Ref1: 4 },
          undefined,
          undefined,
        ],
        [
          true,
          ['NOT IN', [1, 2, 3], '$Ref1'],
          { Ref1: 4 },
          undefined,
          undefined,
        ],
        [
          ['NOT IN', '$Ref1', [1, 2, 3]],
          ['NOT IN', '$Ref1', [1, 2, 3]],
          {},
          undefined,
          undefined,
        ],
        [
          ['NOT IN', 1, ['$Ref1', '$Ref2', '$Ref3']],
          ['NOT IN', 1, ['$Ref1', '$Ref2', '$Ref3']],
          {},
          undefined,
          undefined,
        ],
        [
          ['NOT IN', ['$Ref1', '$Ref2', '$Ref3'], 1],
          ['NOT IN', ['$Ref1', '$Ref2', '$Ref3'], 1],
          {},
          undefined,
          undefined,
        ],
        [
          ['NOT IN', '$Ref1', [1, 2, 3]],
          ['OR', ['==', 1, 2], ['NOT IN', '$Ref1', [1, 2, 3]]],
          {},
          undefined,
          undefined,
        ],
        [
          ['NOT IN', '$Ref1', [1, 2, 3]],
          ['AND', ['==', 1, 1], ['NOT IN', '$Ref1', [1, 2, 3]]],
          {},
          undefined,
          undefined,
        ],
        [true, ['NOT IN', null, [1, 2, 3]], {}, undefined, undefined],
        [
          ['NOT IN', [1, 2, 3], '$Ref1'],
          ['NOT IN', [1, 2, 3], '$Ref1'],
          {},
          undefined,
          undefined,
        ],
        // PREFIX
        [
          true,
          ['PREFIX', 'abc', '$Ref1'],
          { Ref1: 'abcdef' },
          undefined,
          undefined,
        ],
        [
          false,
          ['PREFIX', 'abc', '$Ref1'],
          { Ref1: 'ab' },
          undefined,
          undefined,
        ],
        [
          false,
          ['PREFIX', 'abc', '$Ref1'],
          { Ref1: 'xyz' },
          undefined,
          undefined,
        ],
        [
          ['PREFIX', '$Ref1', 'abc'],
          ['PREFIX', '$Ref1', 'abc'],
          {},
          undefined,
          undefined,
        ],
        [
          ['PREFIX', 'abc', '$Ref1'],
          ['PREFIX', 'abc', '$Ref1'],
          {},
          undefined,
          undefined,
        ],
        [
          false,
          ['PREFIX', 1, '$Ref1'],
          { Ref1: 'abcdef' },
          undefined,
          undefined,
        ],
        // SUFFIX
        [
          true,
          ['SUFFIX', '$Ref1', 'xyz'],
          { Ref1: 'abcdefxyz' },
          undefined,
          undefined,
        ],
        [
          false,
          ['SUFFIX', '$Ref1', 'xyz'],
          { Ref1: 'yz' },
          undefined,
          undefined,
        ],
        [
          false,
          ['SUFFIX', '$Ref1', 'xyz'],
          { Ref1: 'abc' },
          undefined,
          undefined,
        ],
        [
          ['SUFFIX', 'xyz', '$Ref1'],
          ['SUFFIX', 'xyz', '$Ref1'],
          {},
          undefined,
          undefined,
        ],
        [
          ['SUFFIX', '$Ref1', 'xyz'],
          ['SUFFIX', '$Ref1', 'xyz'],
          {},
          undefined,
          undefined,
        ],
        [
          false,
          ['SUFFIX', 1, '$Ref1'],
          { Ref1: 'abcdef' },
          undefined,
          undefined,
        ],
        // OVERLAP
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          {},
          undefined,
          undefined,
        ],
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          {
            Ref1: 4,
          },
          undefined,
          undefined,
        ],
        [
          true,
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          {
            Ref1: 1,
          },
          ['Ref1', 'Ref2'],
          undefined,
        ],
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          {},
          undefined,
          ['Ref1', 'Ref2'],
        ],
        [
          true,
          ['OVERLAP', '$Ref1', [1, 2, 3]],
          {
            Ref1: [1],
          },
          undefined,
          undefined,
        ],
        [
          false,
          ['OVERLAP', [1, 2, 3], ['$Ref1', '$Ref2']],
          {},
          ['Ref1', 'Ref2'],
          undefined,
        ],
        [false, ['OVERLAP', [1, 2, 3], '$Ref1'], {}, ['Ref1'], undefined],
        [
          ['OVERLAP', [1, 2, 3], '$Ref1'],
          ['OVERLAP', [1, 2, 3], '$Ref1'],
          {},
          undefined,
          ['Ref1'],
        ],
        [
          ['OVERLAP', [1, 2, 3], ['$Ref1', '$Ref2']],
          ['OVERLAP', [1, 2, 3], ['$Ref1', '$Ref2']],
          {
            Ref1: 4,
          },
          undefined,
          undefined,
        ],
        [
          [
            'OVERLAP',
            ['$Location1Address.region', '$Location2Address.region'],
            ['DE', 'PA'],
          ],
          [
            'OVERLAP',
            ['$Location1Address.region', '$Location2Address.region'],
            ['DE', 'PA'],
          ],
          {
            Location1Address: {
              street: '633 E Lake Ave',
              city: 'Peoria',
              region: 'IL',
              postalCode: '61614',
              county: '',
              country: 'US',
              secondary: '',
            },
            Location1Wc1Code: {
              code: '9102-2',
              industry: '',
            },
          },
          undefined,
          undefined,
        ],
        [
          false,
          [
            'OR',
            [
              'AND',
              [
                'OVERLAP',
                ['$Location1Address.region', '$Location2Address.region'],
                ['DE', 'PA'],
              ],
              [
                'OVERLAP',
                ['$Location1Wc1Code.code', '$Location2Wc1Code.code'],
                ['0936-2'],
              ],
            ],
            [
              'AND',
              [
                'OVERLAP',
                ['$Location1Address.region', '$Location2Address.region'],
                ['AK', 'IL'],
              ],
              [
                'OVERLAP',
                ['$Location1Wc1Code.code', '$Location2Wc1Code.code'],
                ['7610-3'],
              ],
            ],
          ],
          {
            Location1Address: {
              street: '633 E Lake Ave',
              city: 'Peoria',
              region: 'IL',
              postalCode: '61614',
              county: '',
              country: 'US',
              secondary: '',
            },
            Location1Wc1Code: {
              code: '9102-2',
              industry: '',
            },
          },
          [],
          [],
        ],
        // UNDEFINED
        [
          ['UNDEFINED', '$Ref1'],
          ['UNDEFINED', '$Ref1'],
          {},
          undefined,
          undefined,
        ],
        [true, ['UNDEFINED', '$Ref1'], {}, ['Ref1'], undefined],
        [
          ['UNDEFINED', '$Ref1'],
          ['UNDEFINED', '$Ref1'],
          {},
          undefined,
          ['Ref1'],
        ],
        [false, ['UNDEFINED', '$Ref1'], { Ref1: false }, ['Ref1'], undefined],
        [
          ['UNDEFINED', '$Ref1'],
          ['UNDEFINED', '$Ref1'],
          { Ref1: undefined },
          undefined,
          undefined,
        ],
        [
          false,
          ['UNDEFINED', '$Ref1'],
          { Ref1: 'value' },
          undefined,
          undefined,
        ],
        [false, ['UNDEFINED', '$Ref1'], { Ref1: null }, undefined, undefined],
        // PRESENT
        [
          ['PRESENT', '$Ref1'],
          ['PRESENT', '$Ref1'],
          { Ref1: undefined },
          undefined,
          undefined,
        ],
        [true, ['PRESENT', '$Ref1'], { Ref1: 'value' }, undefined, undefined],
        [false, ['PRESENT', '$Ref1'], { Ref1: null }, undefined, undefined],
        [true, ['PRESENT', '$Ref1'], { Ref1: false }, undefined, undefined],
        [false, ['PRESENT', '$Ref1'], {}, ['Ref1'], undefined],
        [
          true,
          ['PRESENT', '$Ref1'],
          { Ref1: { obj: 'obj' } },
          undefined,
          undefined,
        ],
        // ARITHMETIC
        // SUM
        [true, ['>', ['+', 1, 2, 3], 5], {}, undefined, undefined],
        [
          true,
          ['>', ['+', '$Ref1', '$Ref2'], 2],
          { Ref1: 1, Ref2: 2 },
          undefined,
          undefined,
        ],
        [
          ['>', ['+', '$Ref1', '$Ref2'], 0],
          ['>', ['+', '$Ref1', '$Ref2'], 0],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          ['>', ['+', '$Ref1', '$Ref2'], 3],
          ['>', ['+', '$Ref1', '$Ref2'], ['+', 1, 2]],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          ['>=', ['+', '$Ref1', '$Ref2'], 3],
          ['>=', ['+', '$Ref1', '$Ref2'], ['+', 1, 2]],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          ['<', ['+', '$Ref1', '$Ref2'], 0],
          ['<', ['+', '$Ref1', '$Ref2'], 0],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          ['<=', ['+', '$Ref1', '$Ref2'], 0],
          ['<=', ['+', '$Ref1', '$Ref2'], 0],
          { Ref1: 1 },
          undefined,
          undefined,
        ],
        [
          true,
          ['>', ['+', '$Ref1', 5], 10],
          { Ref1: 10 },
          undefined,
          undefined,
        ],
        [true, ['<', ['+', '$Ref1', 5], 10], { Ref1: 0 }, undefined, undefined],
        [
          true,
          ['<', ['+', '$Ref1', 5], 0],
          { Ref1: -10 },
          undefined,
          undefined,
        ],
        [false, ['>', ['+', null, null], 5], {}, undefined, undefined],
        [
          false,
          [
            'AND',
            [
              '>',
              [
                '+',
                '$Location2Wc1NumberOfFullTimeEmployees',
                '$Location2Wc1NumberOfPartTimeEmployees',
              ],
              99,
            ],
            ['>=', '$NumberOfLocations', 2],
          ],
          { NumberOfLocations: 1 },
          [
            'Location2Wc1NumberOfFullTimeEmployees',
            'Location2Wc1NumberOfPartTimeEmployees',
          ],
          [
            'Location2Wc1NumberOfFullTimeEmployees',
            'Location2Wc1NumberOfPartTimeEmployees',
          ],
        ],
        // SUBTRACT
        [true, ['>', ['-', 5, 2], 2], {}, undefined, undefined],
        [
          true,
          ['>', ['-', '$Ref1', '$Ref2'], 2],
          { Ref1: 5, Ref2: 2 },
          undefined,
          undefined,
        ],
        [
          ['>', ['-', '$Ref1', '$Ref2'], 0],
          ['>', ['-', '$Ref1', '$Ref2'], 0],
          { Ref1: 5 },
          undefined,
          undefined,
        ],
        [
          ['>', ['-', '$Ref1', '$Ref2'], 3],
          ['>', ['-', '$Ref1', '$Ref2'], ['+', 1, 2]],
          { Ref1: 5 },
          undefined,
          undefined,
        ],
        [
          ['>=', ['-', '$Ref1', '$Ref2'], 3],
          ['>=', ['-', '$Ref1', '$Ref2'], ['+', 1, 2]],
          { Ref1: 5 },
          undefined,
          undefined,
        ],
        [
          ['<', ['-', '$Ref1', '$Ref2'], 0],
          ['<', ['-', '$Ref1', '$Ref2'], 0],
          { Ref1: 5 },
          undefined,
          undefined,
        ],
        [
          ['<=', ['-', '$Ref1', '$Ref2'], 0],
          ['<=', ['-', '$Ref1', '$Ref2'], 0],
          { Ref1: 5 },
          undefined,
          undefined,
        ],
        [false, ['>', ['-', null, null], 5], {}, undefined, undefined],
        // MULTIPLY
        [true, ['>', ['*', 2, 3], 5], {}, undefined, undefined],
        [
          true,
          ['>', ['*', '$Ref1', '$Ref2'], 2],
          { Ref1: 2, Ref2: 3 },
          undefined,
          undefined,
        ],
        [
          ['<', ['*', '$Ref1', '$Ref2'], 0],
          ['<', ['*', '$Ref1', '$Ref2'], 0],
          { Ref1: 5 },
          undefined,
          undefined,
        ],
        [false, ['>', ['*', null, null], 5], {}, undefined, undefined],
        // DIVIDE
        [true, ['>=', ['/', 10, 2], 5], {}, undefined, undefined],
        [
          true,
          ['>=', ['/', '$Ref1', '$Ref2'], 2],
          { Ref1: 10, Ref2: 5 },
          undefined,
          undefined,
        ],
        [
          ['>', ['/', '$Ref1', '$Ref2'], 0],
          ['>', ['/', '$Ref1', '$Ref2'], 0],
          { Ref1: 10 },
          undefined,
          undefined,
        ],
        [false, ['>', ['/', null, null], 5], {}, undefined, undefined],
      ]

      for (const [
        expectedResult,
        condition,
        context,
        strictKeys,
        optionalKeys,
      ] of coverageData1) {
        it(`should result in ${JSON.stringify(expectedResult)} for ${JSON.stringify(
          condition
        )}`, () => {
          const result = engine.simplify(
            condition,
            context,
            strictKeys ? new Set(strictKeys) : undefined,
            optionalKeys ? new Set(optionalKeys) : undefined
          )
          assert.deepStrictEqual(result, expectedResult)
        })
      }

      const coverageData2: [
        Input,
        ExpressionInput,
        Context,
        string[] | undefined,
        string[] | undefined,
      ][] = [
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3, '$Ref3']],
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3, '$Ref3']],
          {
            Ref1: 1,
          },
          undefined,
          undefined,
        ],
        [
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
          {
            Ref1: 1,
          },
          [],
          ['Ref1', 'Ref2'],
        ],
        [
          ['IN', 1, ['$Ref1', '$Ref2', '$Ref3']],
          ['IN', 1, ['$Ref1', '$Ref2', '$Ref3']],
          {
            Ref1: 1,
          },
          undefined,
          undefined,
        ],
      ]

      for (const [
        expectedSafeResult,
        condition,
        context,
        strictKeys,
        optionalKeys,
      ] of coverageData2) {
        it(`should have different results as ${JSON.stringify(
          expectedSafeResult
        )} for ${JSON.stringify(condition)}`, () => {
          const safeResult = engine.simplify(
            condition,
            context,
            strictKeys ? new Set(strictKeys) : undefined,
            optionalKeys ? new Set(optionalKeys) : undefined
          )
          assert.deepStrictEqual(safeResult, expectedSafeResult)
        })
      }
    })

    // ===================================================================
    // Bytecode simplifier bug reproduction tests
    // These tests target specific bugs in src/bytecode/simplifier.ts
    // that only manifest with the bytecode evaluator.
    // ===================================================================
    describe('Bytecode simplifier bug reproduction', () => {
      // -----------------------------------------------------------------
      // Bug 1: isInput() rejects null and object literals in residual paths
      //
      // The isInput() type guard returns false for null and Record<string,unknown>,
      // but the Input type from parser/index.ts includes both null and objects.
      // This causes slotSrc() to throw when reconstructing residual expressions
      // that contain null or object literals alongside unknown refs.
      // -----------------------------------------------------------------

      test('should simplify collection containing null + unknown ref (Bug 1a)', () => {
        // Expression: ['IN', '$a', [null, '$b']]
        // With empty context, $a and $b are both unknown.
        // The collection [null, '$b'] has a null literal + unknown ref.
        // In residual reconstruction, slotSrc(null) is called but isInput(null) === false,
        // causing slotSrc to throw.
        const expression: ExpressionInput = ['IN', '$a', [null, '$b']]
        const context: Context = {}
        // Expected: residual reconstruction preserving the collection with null
        const expected: Input = ['IN', '$a', [null, '$b']]

        assert.deepStrictEqual(engine.simplify(expression, context), expected)
      })

      test('should simplify EQ with null literal and unknown ref (Bug 1b)', () => {
        // Expression: ['==', null, '$a']
        // With empty context, $a is unknown.
        // The null literal is pushed via OP_PUSH_VALUE (which accepts null).
        // When reconstructing the residual EQ expression, slotSrc(null) is called
        // but isInput(null) === false, causing slotSrc to throw.
        const expression: ExpressionInput = ['==', null, '$a']
        const context: Context = {}
        // Expected: residual reconstruction preserving the equality with null
        const expected: Input = ['==', null, '$a']

        assert.deepStrictEqual(engine.simplify(expression, context), expected)
      })

      test('should simplify NE with null literal and unknown ref (Bug 1c)', () => {
        // Expression: ['!=', null, '$a']
        // With empty context, $a is unknown.
        // The null literal is pushed via OP_PUSH_VALUE (which accepts null).
        // When reconstructing the residual NE expression, slotSrc(null) is called
        // but isInput(null) === false, causing slotSrc to throw.
        const expression: ExpressionInput = ['!=', null, '$a']
        const context: Context = {}
        // Expected: residual reconstruction preserving the inequality with null
        const expected: Input = ['!=', null, '$a']

        assert.deepStrictEqual(engine.simplify(expression, context), expected)
      })

      // -----------------------------------------------------------------
      // Bug 2: literalAt() rejects null in OP_OR_AND_IN_CONST_2
      //
      // The literalAt() function only accepts string/number/boolean, but null
      // is a valid Input literal. In OP_OR_AND_IN_CONST_2 residual reconstruction,
      // when a null literal is stored in bytecode and the refs are unknown,
      // literalAt(null) throws.
      // -----------------------------------------------------------------

      test('should simplify OR-AND-IN pattern with null literal (Bug 2)', () => {
        // Expression: OR(AND(EQ($a, null), IN($b, [1, 2])), AND(EQ($a, 5), IN($b, [3, 4])))
        // This compiles to OP_OR_AND_IN_CONST_2 where aVal is null.
        // With empty context, both $a and $b are unknown, triggering residual reconstruction.
        // In the reconstruction loop, literalAt(null) is called but throws because
        // literalAt only accepts string/number/boolean.
        const expression: ExpressionInput = [
          'OR',
          ['AND', ['==', '$a', null], ['IN', '$b', [1, 2]]],
          ['AND', ['==', '$a', 5], ['IN', '$b', [3, 4]]],
        ]
        const context: Context = {}
        // Expected: residual reconstruction preserving the OR-AND-IN pattern
        const expected: Input = [
          'OR',
          ['AND', ['==', '$a', null], ['IN', '$b', [1, 2]]],
          ['AND', ['==', '$a', 5], ['IN', '$b', [3, 4]]],
        ]

        assert.deepStrictEqual(engine.simplify(expression, context), expected)
      })

      // -----------------------------------------------------------------
      // Bug 3: OP_PUSH_VALUE guard rejects object literals (Record<string,unknown>)
      //
      // The OP_PUSH_VALUE handler throws on non-null, non-array objects.
      // But the parser's Input type includes Record<string,unknown>.
      // When simplifying an expression with an object literal value,
      // the compiler pushes the object via OP_PUSH_VALUE and the simplifier throws.
      // -----------------------------------------------------------------

      test('should simplify expression with object literal value (Bug 3a)', () => {
        // Expression: ['==', '$a', {foo: 1}]
        // With empty context, $a is unknown.
        // The object literal {foo: 1} is pushed via OP_PUSH_VALUE.
        // The simplifier throws: "bytecode integrity error: unexpected object in OP_PUSH_VALUE"
        const expression: ExpressionInput = ['==', '$a', { foo: 1 }]
        const context: Context = {}
        // Expected: residual reconstruction preserving the equality with object literal
        const expected: Input = ['==', '$a', { foo: 1 }]

        assert.deepStrictEqual(engine.simplify(expression, context), expected)
      })

      test('should simplify expression with nested object literal value (Bug 3b)', () => {
        // Expression: ['==', '$a', {nested: {deep: true}}]
        // Same pattern as Bug 3a but with a deeply nested object.
        const expression: ExpressionInput = [
          '==',
          '$a',
          { nested: { deep: true } },
        ]
        const context: Context = {}
        // Expected: residual reconstruction preserving the equality with object literal
        const expected: Input = ['==', '$a', { nested: { deep: true } }]

        assert.deepStrictEqual(engine.simplify(expression, context), expected)
      })
    })
  })
}
