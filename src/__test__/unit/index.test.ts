import Engine from '../../'
import { Context } from '../../common/evaluable'
import { OPERATOR as OPERATOR_EQ } from '../../expression/comparison/eq'
import { OPERATOR as OPERATOR_GE } from '../../expression/comparison/ge'
import { OPERATOR as OPERATOR_GT } from '../../expression/comparison/gt'
import { OPERATOR as OPERATOR_IN } from '../../expression/comparison/in'
import { OPERATOR as OPERATOR_LE } from '../../expression/comparison/le'
import { OPERATOR as OPERATOR_LT } from '../../expression/comparison/lt'
import { OPERATOR as OPERATOR_NE } from '../../expression/comparison/ne'
import { OPERATOR as OPERATOR_NOT_IN } from '../../expression/comparison/not-in'
import { OPERATOR as OPERATOR_PREFIX } from '../../expression/comparison/prefix'
import { OPERATOR as OPERATOR_SUFFIX } from '../../expression/comparison/suffix'
import { OPERATOR as OPERATOR_AND } from '../../expression/logical/and'
import { OPERATOR as OPERATOR_NOR } from '../../expression/logical/nor'
import { OPERATOR as OPERATOR_OR } from '../../expression/logical/or'
import { OPERATOR as OPERATOR_XOR } from '../../expression/logical/xor'
import { ExpressionInput, Input } from '../../parser'

describe('Condition Engine', () => {
  const engine = new Engine()

  describe('evaluate', () => {
    test.each(
      [
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
    )('%p in %p should evaluate as %p', (expression, context, expected) => {
      expect(engine.evaluate(expression, context)).toEqual(expected)
    })

    test.each([
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
    ])('%p should throw', (expression) => {
      expect(() =>
        engine.evaluate(expression as ExpressionInput, {})
      ).toThrowError()
    })
  })

  test('statement', () => {
    const exceptions = [
      { expression: [OPERATOR_EQ] },
      { expression: [OPERATOR_EQ, 5] },
      { expression: [OPERATOR_EQ, 5, 5, 5] },
      { expression: [OPERATOR_NE] },
      { expression: [OPERATOR_GT] },
      { expression: [OPERATOR_GE] },
      { expression: [OPERATOR_LT] },
      { expression: [OPERATOR_LE] },
      { expression: [OPERATOR_IN] },
      { expression: [OPERATOR_NOT_IN] },
      { expression: [OPERATOR_PREFIX] },
      { expression: [OPERATOR_SUFFIX] },
      { expression: [OPERATOR_AND] },
      { expression: [OPERATOR_OR] },
      { expression: [OPERATOR_NOR] },
      { expression: [OPERATOR_XOR] },
    ]

    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => engine.statement(exception.expression)).toThrowError()
    }
  })

  describe('parse', () => {
    test.each([
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
    ])('%p should throw', (expression) => {
      expect(() => engine.parse(expression as ExpressionInput)).toThrowError()
    })
  })

  describe('simplify', () => {
    test.each<
      [
        exp: ExpressionInput,
        ctx: Context,
        expected: boolean | Input,
        alwaysEvaluate?: false | string[],
        deferEvaluate?: false | string[]
      ]
    >([
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
        false,
        ['e'],
      ],
      [
        ['OR', ['==', '$a', 10], ['==', '$b', 20], ['==', '$c', 20]],
        { c: 10 },
        ['==', '$b', 20],
        false,
        ['b'],
      ],
    ])(
      '%p with context %p should be simplified to %p',
      (exp, ctx, expected, alwaysEvaluate = false, deferEvaluate = false) => {
        const engine = new Engine()
        expect(
          engine.simplify(exp, ctx, alwaysEvaluate, deferEvaluate)
        ).toEqual(expected)
      }
    )
  })
})
