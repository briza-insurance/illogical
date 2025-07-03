import Engine from '../../'
import { Context } from '../../common/evaluable'
import { OPERATOR as OPERATOR_SUM } from '../../expression/arithmetic/sum'
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
    )('%p in %p should evaluate as %p', (expression, context, expected) => {
      expect(engine.evaluate(expression, context)).toEqual(expected)
    })

    test.each<[ExpressionInput, Context, boolean]>([
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
    ])('%p should evaluate to %p', (expression, context, expectedResult) => {
      expect(engine.evaluate(expression, context)).toEqual(expectedResult)
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
      [[OPERATOR_SUM]],
      [[OPERATOR_SUM, 5, 5, 5]],
    ])('%p should throw', (expression) => {
      expect(() =>
        engine.evaluate(expression as ExpressionInput, {})
      ).toThrowError()
    })

    test.each<[ExpressionInput]>([
      [['+', 5, 5]],
      [['-', 5, 5]],
      [['*', 5, 5]],
      [['/', 5, 5]],
    ])('%p should throw', (expression) => {
      expect(() => engine.evaluate(expression, {})).toThrowError(
        'invalid expression'
      )
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
      [[OPERATOR_SUM]],
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
        strictKeys?: string[],
        optionalKeys?: string[],
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
        ['>', ['/', 10, 0], ['+', '$a', 0]], // Infinity doesn't get simplified to avoid conversion loss
      ],
      [['>', ['/', '$a', 0], ['+', 0, 0]], { b: 0 }, ['>', ['/', '$a', 0], 0]],
      [['>', ['+', 0, 0], ['/', '$a', 0]], { b: 0 }, ['>', 0, ['/', '$a', 0]]],
      [['==', ['+', ['*', 9, 9], 19], 100], {}, true],
      [['==', ['+', ['*', 9, 9], ['-', ['/', 250, 5], 31]], 100], {}, true],
      [['AND', ['==', ['+', 1, 1], 2], ['==', ['+', 2, 2], 4]], {}, true],
      [
        ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
        { Ref1: 4 },
        ['OVERLAP', ['$Ref1', '$Ref2'], [1, 2, 3]],
      ],
    ])(
      '%p with context %p should be simplified to %p',
      (
        exp,
        ctx,
        expected,
        strictKeys = undefined,
        optionalKeys = undefined
      ) => {
        const engine = new Engine()
        expect(engine.simplify(exp, ctx, strictKeys, optionalKeys)).toEqual(
          expected
        )
      }
    )

    test.each<[ExpressionInput]>([
      [['+', 5, 5]],
      [['-', 5, 5]],
      [['*', 5, 5]],
      [['/', 5, 5]],
      [['+', ['AND', ['==', 1, 1]], 1]],
      [['AND', ['+', 1, -1], ['+', ['-', 1, 1], 1]]],
      [['NOT', ['+', 1, 1]]],
    ])('%p should throw', (expression) => {
      expect(() => engine.simplify(expression, {})).toThrowError(
        'invalid expression'
      )
    })
  })

  describe('unsafeSimplify', () => {
    it.each<
      [
        Input,
        ExpressionInput,
        Context,
        string[] | undefined,
        string[] | undefined,
      ]
    >([
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
      [true, ['IN', '$Ref1', [1, 2, 3]], { Ref1: 1 }, undefined, undefined],
      [false, ['IN', '$Ref1', [1, 2, 3]], { Ref1: 4 }, undefined, undefined],
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
    ])(
      'should result in %j',
      (expectedResult, condition, context, strictKeys, optionalKeys) => {
        const unsafeResult = engine.unsafeSimplify(
          condition,
          context,
          strictKeys,
          optionalKeys
        )
        const safeResult = engine.simplify(
          condition,
          context,
          strictKeys,
          optionalKeys
        )
        expect(unsafeResult).toEqual(expectedResult)
        expect(safeResult).toEqual(expectedResult)
        expect(safeResult).toEqual(unsafeResult)
      }
    )
  })
})
