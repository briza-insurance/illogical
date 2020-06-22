import { Parser } from '../../'
import {
  defaultOptions,
  defaultReferencePredicate,
  defaultReferenceTransform
} from '../../options'
import { Value } from '../../../operand/value'
import { Reference } from '../../../operand/reference'
import {
  Equal,
  OPERATOR as OPERATOR_EQ,
} from '../../../expression/comparison/eq'
import {
  NotEqual,
  OPERATOR as OPERATOR_NE,
} from '../../../expression/comparison/ne'
import {
  GreaterThan,
  OPERATOR as OPERATOR_GT,
} from '../../../expression/comparison/gt'
import {
  GreaterThanOrEqual,
  OPERATOR as OPERATOR_GE,
} from '../../../expression/comparison/ge'
import {
  LessThan,
  OPERATOR as OPERATOR_LT,
} from '../../../expression/comparison/lt'
import {
  LessThanOrEqual,
  OPERATOR as OPERATOR_LE,
} from '../../../expression/comparison/le'
import {
  In,
  OPERATOR as OPERATOR_IN,
} from '../../../expression/comparison/in'
import {
  NotIn,
  OPERATOR as OPERATOR_NOT_IN,
} from '../../../expression/comparison/not-in'
import {
  Prefix,
  OPERATOR as OPERATOR_PREFIX,
} from '../../../expression/comparison/prefix'
import {
  Suffix,
  OPERATOR as OPERATOR_SUFFIX,
} from '../../../expression/comparison/suffix'
import {
  Overlap,
  OPERATOR as OPERATOR_OVERLAP,
} from '../../../expression/comparison/overlap'
import {
  Undefined,
  OPERATOR as OPERATOR_UNDEFINED,
} from '../../../expression/comparison/undefined'
import { And, OPERATOR as OPERATOR_AND } from '../../../expression/logical/and'
import { Or, OPERATOR as OPERATOR_OR } from '../../../expression/logical/or'
import { Nor, OPERATOR as OPERATOR_NOR } from '../../../expression/logical/nor'
import { Xor, OPERATOR as OPERATOR_XOR } from '../../../expression/logical/xor'
import { Not, OPERATOR as OPERATOR_NOT } from '../../../expression/logical/not'
import { Collection } from '../../../operand/collection'

describe('Condition Engine - Parser', () => {
  test('options', () => {
    let customOptions = {
      operatorMapping: new Map([[OPERATOR_EQ, '&&']]),
      notExpected: 10,
    }

    // @ts-ignore
    const parser = new Parser(customOptions)

    // @ts-ignore
    expect(parser.options.operatorMapping.get(OPERATOR_EQ)).toEqual('&&')
    expect(parser.options.notExpected).toBeUndefined()
  })

  test('defaultReferencePredicate', () => {
    let tests = [
      // Truthy
      { key: '$ref', expected: true },

      // Falsy
      { key: 'ref', expected: false },
      { key: '', expected: false },
      { key: 5, expected: false },
      { key: true, expected: false },
      { key: false, expected: false },
      { key: [5], expected: false },
      { key: ['5'], expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(defaultReferencePredicate(test.key))
        .toBe(test.expected)
    }
  })

  test('defaultReferenceTransform', () => {
    let tests = [
      { key: '$ref', expected: 'ref' },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(defaultReferenceTransform(test.key))
        .toBe(test.expected)
    }
  })

  test('parse', () => {
    const parser = new Parser()

    const tests = [
      // Comparison expression
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
        expected: new Equal(new Value(5), new Value(5))
      },
      // Predicate expression
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_UNDEFINED), '$RefA'],
        expected: new Undefined(new Reference('RefA'))
      },
      // Logical expression
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
          [defaultOptions.operatorMapping.get(OPERATOR_UNDEFINED), '$RefA'],
        ],
        expected: new And([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10)),
          new Undefined(new Reference('RefA')),
        ])
      },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(parser.parse(test.rawExpression))
        .toEqual(test.expected)
    }

    const exceptions = [
      // Invalid form
      { rawExpression: undefined},
      { rawExpression: null},
      { rawExpression: {}},
      { rawExpression: 5},
      { rawExpression: ''},
      { rawExpression: ()=>{}},
      // Invalid operator
      { rawExpression: ['__', ['==', 5, 5]] },
    ]

    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => parser.parse(exception.rawExpression))
        .toThrowError()
    }
  })

  test('parse - logical expressions', () => {
    const parser = new Parser()

    const tests = [
      // Not-nested, 3 items
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        expected: new And([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10))
        ])
      },
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        expected: new Or([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10))
        ])
      },
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_NOR),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        expected: new Nor([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10))
        ])
      },
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_XOR),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        expected: new Xor([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10))
        ])
      },
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_NOT),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5]
        ],
        expected: new Not(new Equal(new Value(5), new Value(5)))
      },
      // Not-nested, 2 items, reduced into comparison
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
        ],
        expected: new Equal(new Value(5), new Value(5)),
      },
      // Not-nested, 2 items, reduced into logical
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
          ],
        ],
        expected: new Or([
          new Equal(new Value(5), new Value(5)),
          new Equal(new Value(10), new Value(10))
        ])
      },
      // Nested
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
          ],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 15, 15],
        ],
        expected: new And([
          new Or([
            new Equal(new Value(5), new Value(5)),
            new Equal(new Value(10), new Value(10))
          ]),
          new Equal(new Value(15), new Value(15))
        ])
      },
      // Zero argument logical expression treated as collection
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_IN),
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR)
          ]
        ],
        expected: new In(
          new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
          new Collection([new Value(defaultOptions.operatorMapping.get(OPERATOR_OR))])
        )
      },
      {
        rawExpression: [
          defaultOptions.operatorMapping.get(OPERATOR_IN),
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            defaultOptions.operatorMapping.get(OPERATOR_AND)
          ]
        ],
        expected: new In(
          new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
          new Collection([
            new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
            new Value(defaultOptions.operatorMapping.get(OPERATOR_AND))
          ])
        )
      }
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(parser.parse(test.rawExpression))
        .toEqual(test.expected)
    }

    const exceptions = [
      // Invalid form
      { rawExpression: []},
      // Invalid operator, reduce-able expression
      { rawExpression: ['__', ['==', 5, 5]] },
      // Invalid operator
      { rawExpression: ['__', ['==', 5, 5], ['==', 5, 5]] },
      // Invalid logical inner expression
      { rawExpression: ['IN', 'OR', ['OR', 'AND', [5, 5]]] },
    ]

    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => parserStrict.parseLogicalRawExp(exception.rawExpression))
        .toThrowError()
    }
  })

  test('parse - comparison expressions', () => {
    const parser = new Parser()

    const tests = [
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
        expected: new Equal(new Value(5), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_NE), 5, 5],
        expected: new NotEqual(new Value(5), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_GT), 5, 5],
        expected: new GreaterThan(new Value(5), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_GE), 5, 5],
        expected: new GreaterThanOrEqual(new Value(5), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_LT), 5, 5],
        expected: new LessThan(new Value(5), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_LE), 5, 5],
        expected: new LessThanOrEqual(new Value(5), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_IN), 5, [5]],
        expected: new In(new Value(5), new Collection([new Value(5)]))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_NOT_IN), 5, [5]],
        expected: new NotIn(new Value(5), new Collection([new Value(5)]))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_PREFIX), 'a', 'abc'],
        expected: new Prefix(new Value('a'), new Value('abc'))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_SUFFIX), 'abc', 'c'],
        expected: new Suffix(new Value('abc'), new Value('c'))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_OVERLAP), ['a','b'], ['a']],
        expected: new Overlap(new Collection([new Value('a'), new Value('b')]), new Collection([new Value('a')]))
      },
      // Reference
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_EQ), '$RefA', 5],
        expected: new Equal(new Reference('RefA'), new Value(5))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, '$RefA'],
        expected: new Equal(new Value(5), new Reference('RefA'))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_UNDEFINED), '$RefA'],
        expected: new Undefined(new Reference('RefA'))
      },
      {
        rawExpression: [defaultOptions.operatorMapping.get(OPERATOR_OVERLAP), ['$RefA','$RefB'], ['a']],
        expected: new Overlap(
          new Collection([
            new Reference('RefA'),
            new Reference('RefB'),
          ]),
          new Collection([new Value('a')])
        )
      }
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(parser.parse(test.rawExpression))
        .toEqual(test.expected)
    }

    const exceptions = [
      // Invalid form
      { rawExpression: [] },
      // Invalid operator
      { rawExpression: ['__', 5, 5] },
    ]

    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => parser.parse(exception.rawExpression))
        .toThrowError()
    }
  })
})
