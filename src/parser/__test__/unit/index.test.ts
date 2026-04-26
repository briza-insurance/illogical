import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { Evaluable } from '../../../common/evaluable.js'
import {
  Divide,
  OPERATOR as OPERATOR_DIVIDE,
} from '../../../expression/arithmetic/divide.js'
import {
  Multiply,
  OPERATOR as OPERATOR_MULTIPLY,
} from '../../../expression/arithmetic/multiply.js'
import {
  OPERATOR as OPERATOR_SUBTRACT,
  Subtract,
} from '../../../expression/arithmetic/subtract.js'
import {
  OPERATOR as OPERATOR_SUM,
  Sum,
} from '../../../expression/arithmetic/sum.js'
import {
  Equal,
  OPERATOR as OPERATOR_EQ,
} from '../../../expression/comparison/eq.js'
import {
  GreaterThanOrEqual,
  OPERATOR as OPERATOR_GE,
} from '../../../expression/comparison/ge.js'
import {
  GreaterThan,
  OPERATOR as OPERATOR_GT,
} from '../../../expression/comparison/gt.js'
import {
  In,
  OPERATOR as OPERATOR_IN,
} from '../../../expression/comparison/in.js'
import {
  LessThanOrEqual,
  OPERATOR as OPERATOR_LE,
} from '../../../expression/comparison/le.js'
import {
  LessThan,
  OPERATOR as OPERATOR_LT,
} from '../../../expression/comparison/lt.js'
import {
  NotEqual,
  OPERATOR as OPERATOR_NE,
} from '../../../expression/comparison/ne.js'
import {
  NotIn,
  OPERATOR as OPERATOR_NOT_IN,
} from '../../../expression/comparison/not-in.js'
import {
  OPERATOR as OPERATOR_OVERLAP,
  Overlap,
} from '../../../expression/comparison/overlap.js'
import {
  OPERATOR as OPERATOR_PREFIX,
  Prefix,
} from '../../../expression/comparison/prefix.js'
import {
  OPERATOR as OPERATOR_PRESENT,
  Present,
} from '../../../expression/comparison/present.js'
import {
  OPERATOR as OPERATOR_SUFFIX,
  Suffix,
} from '../../../expression/comparison/suffix.js'
import {
  OPERATOR as OPERATOR_UNDEFINED,
  Undefined,
} from '../../../expression/comparison/undefined.js'
import {
  And,
  OPERATOR as OPERATOR_AND,
} from '../../../expression/logical/and.js'
import {
  Nor,
  OPERATOR as OPERATOR_NOR,
} from '../../../expression/logical/nor.js'
import {
  Not,
  OPERATOR as OPERATOR_NOT,
} from '../../../expression/logical/not.js'
import { OPERATOR as OPERATOR_OR, Or } from '../../../expression/logical/or.js'
import {
  OPERATOR as OPERATOR_XOR,
  Xor,
} from '../../../expression/logical/xor.js'
import { Collection } from '../../../operand/collection.js'
import { Reference } from '../../../operand/reference.js'
import { Value } from '../../../operand/value.js'
import { ExpressionInput, Parser } from '../../index.js'
import {
  defaultOptions,
  defaultReferencePredicate,
  defaultReferenceTransform,
} from '../../options.js'

function getOp(sym: symbol): string {
  const op = defaultOptions.operatorMapping.get(sym)
  if (op === undefined) {
    throw new Error(`Operator not registered: ${sym.toString()}`)
  }
  return op
}

describe('Condition Engine - Parser', () => {
  const parser = new Parser()

  test('options', () => {
    const customOptions = {
      operatorMapping: new Map([[OPERATOR_EQ, '&&']]),
      notExpected: 10,
    }

    const parser = new Parser(customOptions)

    assert.deepStrictEqual(
      parser.options.operatorMapping.get(OPERATOR_EQ),
      '&&'
    )
  })

  describe('defaultReferencePredicate', () => {
    const testCases = [
      // Truthy
      ['$ref', true],
      // Falsy
      ['ref', false],
      ['', false],
      // Falsy other raw types
      [5, false],
      [true, false],
      [false, false],
      [[5], false],
      [['5'], false],
    ]
    for (const [key, expected] of testCases) {
      test(`${key} should evaluate as ${expected}`, () => {
        assert.strictEqual(defaultReferencePredicate(key), expected)
      })
    }
  })

  describe('defaultReferenceTransform', () => {
    const testCases = [['$ref', 'ref']]
    for (const [key, expected] of testCases) {
      test(`${key} should evaluate as ${expected}`, () => {
        assert.strictEqual(defaultReferenceTransform(key), expected)
      })
    }
  })

  describe('parse', () => {
    const testCases: [ExpressionInput, Evaluable][] = [
      // Comparison expression
      [[getOp(OPERATOR_EQ), 5, 5], new Equal(new Value(5), new Value(5))],
      // Unary expression
      [
        [getOp(OPERATOR_UNDEFINED), '$RefA'],
        new Undefined(new Reference('RefA')),
      ],
      // Logical expression
      [
        [
          getOp(OPERATOR_AND),
          [getOp(OPERATOR_EQ), 5, 5],
          [getOp(OPERATOR_EQ), 10, 10],
          [getOp(OPERATOR_UNDEFINED), '$RefA'],
        ],
        new And([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
          new Undefined(new Reference('RefA')),
        ]),
      ],
      // Arithmetic expression - cannot be as root expression
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_SUM), 5, 5], 10],
        new Equal(new Sum(new Value(5), new Value(5)), new Value(10)),
      ],
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_SUBTRACT), 5, 5], 0],
        new Equal(new Subtract(new Value(5), new Value(5)), new Value(0)),
      ],
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_MULTIPLY), 5, 5], 25],
        new Equal(new Multiply(new Value(5), new Value(5)), new Value(25)),
      ],
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_DIVIDE), 5, 5], 1],
        new Equal(new Divide(new Value(5), new Value(5)), new Value(1)),
      ],
    ]

    for (const [expression, expected] of testCases) {
      test(`${JSON.stringify(expression)} should evaluate as ${expected}`, () => {
        assert.deepStrictEqual(
          parser.parse(expression).serialize(defaultOptions),
          expected.serialize(defaultOptions)
        )
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const throwTestCases = [
      // Invalid form
      [undefined],
      [null],
      [{}],
      [5],
      [''],
      [() => {}],
      // Invalid operator
      [['__', ['==', 5, 5]]],
      [getOp(OPERATOR_SUM), 5, 5],
    ] as [ExpressionInput][]
    for (const [expression] of throwTestCases) {
      test(`${JSON.stringify(expression)} should throw`, () => {
        assert.throws(() => parser.parse(expression))
      })
    }
  })

  describe('parse - logical expressions', () => {
    const testCases: [ExpressionInput, Evaluable][] = [
      // Not-nested, 3 items
      [
        [
          getOp(OPERATOR_AND),
          [getOp(OPERATOR_EQ), 5, 5],
          [getOp(OPERATOR_EQ), 10, 10],
        ],
        new And([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
        ]),
      ],
      [
        [
          getOp(OPERATOR_OR),
          [getOp(OPERATOR_EQ), 5, 5],
          [getOp(OPERATOR_EQ), 10, 10],
        ],
        new Or([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
        ]),
      ],
      [
        [
          getOp(OPERATOR_NOR),
          [getOp(OPERATOR_EQ), 5, 5],
          [getOp(OPERATOR_EQ), 10, 10],
        ],
        new Nor([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
        ]),
      ],
      [
        [
          getOp(OPERATOR_XOR),
          [getOp(OPERATOR_EQ), 5, 5],
          [getOp(OPERATOR_EQ), 10, 10],
        ],
        new Xor([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
        ]),
      ],
      [
        [getOp(OPERATOR_NOT), [getOp(OPERATOR_EQ), 5, 5]],
        new Not(new Equal(new Value(5), new Value(5))),
      ],
      // Not-nested, 2 items, reduced into comparison
      [
        [getOp(OPERATOR_AND), [getOp(OPERATOR_EQ), 5, 5]],
        new Equal(new Value(5), new Value(5)),
      ],
      // Not-nested, 2 items, reduced into logical
      [
        [
          getOp(OPERATOR_AND),
          [
            getOp(OPERATOR_OR),
            [getOp(OPERATOR_EQ), 5, 5],
            [getOp(OPERATOR_EQ), 10, 10],
          ],
        ],
        new Or([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
        ]),
      ],
      // Nested
      [
        [
          getOp(OPERATOR_AND),
          [
            getOp(OPERATOR_OR),
            [getOp(OPERATOR_EQ), 5, 5],
            [getOp(OPERATOR_EQ), 10, 10],
          ],
          [getOp(OPERATOR_EQ), 15, 15],
        ],
        new And([
          new Or([
            new Equal(new Value(5), new Value(5)),
            new Equal(new Value(10), new Value(10)),
          ]),
          new Equal(new Value(15), new Value(15)),
        ]),
      ],
      // Zero argument logical expression treated as collection
      [
        [getOp(OPERATOR_IN), getOp(OPERATOR_OR), [getOp(OPERATOR_OR)]],
        new In(
          new Value(getOp(OPERATOR_OR)),
          new Collection([new Value(getOp(OPERATOR_OR))])
        ),
      ],
      [
        [
          getOp(OPERATOR_IN),
          getOp(OPERATOR_OR),
          [getOp(OPERATOR_OR), getOp(OPERATOR_AND)],
        ],
        new In(
          new Value(getOp(OPERATOR_OR)),
          new Collection([
            new Value(getOp(OPERATOR_OR)),
            new Value(getOp(OPERATOR_AND)),
          ])
        ),
      ],
      [
        [
          getOp(OPERATOR_IN),
          getOp(OPERATOR_OR),
          [getOp(OPERATOR_OR), 'AK', 'MN'],
        ],
        new In(
          new Value(getOp(OPERATOR_OR)),
          new Collection([
            new Value(getOp(OPERATOR_OR)),
            new Value('AK'),
            new Value('MN'),
          ])
        ),
      ],
      // Not treated as raw array
      [
        [getOp(OPERATOR_NOT), 5],
        new Collection([new Value(getOp(OPERATOR_NOT)), new Value(5)]),
      ],
    ]

    for (const [expression, expected] of testCases) {
      test(`${JSON.stringify(expression)} should evaluate as ${expected}`, () => {
        assert.deepStrictEqual(parser.parse(expression), expected)
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const throwTestCases = [
      // Invalid form
      [[]],
      // Invalid operator, reduce-able expression
      [['__', ['==', 5, 5]]],
      // Invalid operator
      [['__', ['==', 5, 5], ['==', 5, 5]]],
      // Invalid logical inner expression
      [['IN', 'OR', ['OR', 'AND', [5, 5]]]],
    ] as [ExpressionInput][]
    for (const [expression] of throwTestCases) {
      test(`${JSON.stringify(expression)} should throw`, () => {
        assert.throws(() => parser.parse(expression))
      })
    }
  })

  describe('parse - comparison expressions', () => {
    const testCases: [ExpressionInput, Evaluable][] = [
      [[getOp(OPERATOR_EQ), 5, 5], new Equal(new Value(5), new Value(5))],
      [[getOp(OPERATOR_NE), 5, 5], new NotEqual(new Value(5), new Value(5))],
      [[getOp(OPERATOR_GT), 5, 5], new GreaterThan(new Value(5), new Value(5))],
      [
        [getOp(OPERATOR_GE), 5, 5],
        new GreaterThanOrEqual(new Value(5), new Value(5)),
      ],
      [[getOp(OPERATOR_LT), 5, 5], new LessThan(new Value(5), new Value(5))],
      [
        [getOp(OPERATOR_LE), 5, 5],
        new LessThanOrEqual(new Value(5), new Value(5)),
      ],
      [
        [getOp(OPERATOR_IN), 5, [5]],
        new In(new Value(5), new Collection([new Value(5)])),
      ],
      [
        [getOp(OPERATOR_IN), 5, [getOp(OPERATOR_EQ), 2, 2]],
        new In(
          new Value(5),
          new Collection([
            new Value(getOp(OPERATOR_EQ)),
            new Value(2),
            new Value(2),
          ])
        ),
      ],
      [
        [getOp(OPERATOR_NOT_IN), 5, [5]],
        new NotIn(new Value(5), new Collection([new Value(5)])),
      ],
      [
        [getOp(OPERATOR_PREFIX), 'a', 'abc'],
        new Prefix(new Value('a'), new Value('abc')),
      ],
      [
        [getOp(OPERATOR_SUFFIX), 'abc', 'c'],
        new Suffix(new Value('abc'), new Value('c')),
      ],
      [
        [getOp(OPERATOR_OVERLAP), ['a', 'b'], ['IN']],
        new Overlap(
          new Collection([new Value('a'), new Value('b')]),
          new Collection([new Value('IN')])
        ),
      ],
      // Reference
      [
        [getOp(OPERATOR_EQ), '$RefA', 5],
        new Equal(new Reference('RefA'), new Value(5)),
      ],
      [
        [getOp(OPERATOR_EQ), 5, '$RefA'],
        new Equal(new Value(5), new Reference('RefA')),
      ],
      [
        [getOp(OPERATOR_UNDEFINED), '$RefA'],
        new Undefined(new Reference('RefA')),
      ],
      [[getOp(OPERATOR_PRESENT), '$RefA'], new Present(new Reference('RefA'))],
      [
        [getOp(OPERATOR_OVERLAP), ['$RefA', '$RefB'], ['a']],
        new Overlap(
          new Collection([new Reference('RefA'), new Reference('RefB')]),
          new Collection([new Value('a')])
        ),
      ],
      [
        [getOp(OPERATOR_PRESENT), '$RefA{RefB}'],
        new Present(new Reference('RefA{RefB}')),
      ],
    ]
    for (const [expression, expected] of testCases) {
      test(`${JSON.stringify(expression)} should evaluate as ${expected}`, () => {
        assert.deepStrictEqual(
          parser.parse(expression).serialize(defaultOptions),
          expected.serialize(defaultOptions)
        )
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const throwTestCases = [
      // Invalid form
      [[]],
      // Invalid operator
      [['__', 5, 5]],
    ] as [ExpressionInput][]
    for (const [expression] of throwTestCases) {
      test(`${JSON.stringify(expression)} should throw`, () => {
        assert.throws(() => parser.parse(expression))
      })
    }
  })

  describe('parse - arithmetic expressions', () => {
    const testCases: [ExpressionInput, Evaluable][] = [
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_SUM), 5, 5], 10],
        new Equal(new Sum(new Value(5), new Value(5)), new Value(10)),
      ],
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_SUBTRACT), 5, 5], 0],
        new Equal(new Subtract(new Value(5), new Value(5)), new Value(0)),
      ],
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_MULTIPLY), 5, 5], 25],
        new Equal(new Multiply(new Value(5), new Value(5)), new Value(25)),
      ],
      [
        [getOp(OPERATOR_EQ), [getOp(OPERATOR_DIVIDE), 5, 5], 1],
        new Equal(new Divide(new Value(5), new Value(5)), new Value(1)),
      ],
    ]
    for (const [expression, expected] of testCases) {
      test(`${JSON.stringify(expression)} should evaluate as ${expected}`, () => {
        assert.deepStrictEqual(
          parser.parse(expression).serialize(defaultOptions),
          expected.serialize(defaultOptions)
        )
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const throwTestCases = [
      // Invalid form
      [[]],
      // Invalid operator
      [['__', 5, 5]],
      // Invalid root operator
      [['+', 5, 5]],
      [['-', 5, 5]],
      [['*', 5, 5]],
      [['/', 5, 5]],
    ] as [ExpressionInput][]
    for (const [expression] of throwTestCases) {
      test(`${JSON.stringify(expression)} should throw`, () => {
        assert.throws(() => parser.parse(expression))
      })
    }
  })
})
