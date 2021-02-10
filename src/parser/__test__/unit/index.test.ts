import { ExpressionInput, Parser } from '../../'
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
import {
  Present,
  OPERATOR as OPERATOR_PRESENT,
} from '../../../expression/comparison/present'
import { And, OPERATOR as OPERATOR_AND } from '../../../expression/logical/and'
import { Or, OPERATOR as OPERATOR_OR } from '../../../expression/logical/or'
import { Nor, OPERATOR as OPERATOR_NOR } from '../../../expression/logical/nor'
import { Xor, OPERATOR as OPERATOR_XOR } from '../../../expression/logical/xor'
import { Not, OPERATOR as OPERATOR_NOT } from '../../../expression/logical/not'
import { Collection } from '../../../operand/collection'
import { Evaluable } from '../../../common/evaluable'

const defaultOpt = { allowCrossTypeParsing: false }

describe('Condition Engine - Parser', () => {
  const parser = new Parser()

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

  describe('defaultReferencePredicate', () => {
    test.each([
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
      [['5'], false]
    ])('%p should evaluate as %p', (key, expected) => {
      // @ts-ignore
      expect(defaultReferencePredicate(key)).toBe(expected)
    })
  })

  describe('defaultReferenceTransform', () => {
    test.each([
      ['$ref', 'ref'],
    ])('%p should evaluate as %p', (key, expected) => {
      expect(defaultReferenceTransform(key)).toBe(expected)
    })
  })

  describe('parse', () => {
    test.each([
      // Comparison expression
      [
        [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
        new Equal(defaultOpt, new Value(5), new Value(5))
      ],
      // Unary expression
      [
        [defaultOptions.operatorMapping.get(OPERATOR_UNDEFINED), '$RefA'],
        new Undefined(new Reference('RefA'))
      ],
      // Logical expression
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
          [defaultOptions.operatorMapping.get(OPERATOR_UNDEFINED), '$RefA'],
        ],
        new And([
          new Equal(defaultOpt, new Value(5), new Value(5)),
          new Equal(defaultOpt, new Value(10), new Value(10)),
          new Undefined(new Reference('RefA')),
        ])
      ],
    ] as [ExpressionInput, Evaluable][])
      ('%p should evaluate as %p', (expression, expected) => {
        expect(parser.parse(expression)).toEqual(expected)
      })

    test.each([
      // Invalid form
      [undefined],
      [null],
      [{}],
      [5],
      [''],
      [() => { }],
      // Invalid operator
      [['__', ['==', 5, 5]]],
    ] as [ExpressionInput][])
      ('%p should throw', (expression) => {
        expect(() => parser.parse(expression)).toThrowError()
      })
  })

  describe('parse - logical expressions', () => {
    test.each([
      // Not-nested, 3 items
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        new And([
          new Equal(defaultOpt, new Value(5), new Value(5)),
          new Equal(defaultOpt, new Value(10), new Value(10))
        ])
      ],
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        new Or([
          new Equal(defaultOpt, new Value(5), new Value(5)),
          new Equal(defaultOpt, new Value(10), new Value(10))
        ])
      ],
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_NOR),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        new Nor([
          new Equal(defaultOpt, new Value(5), new Value(5)),
          new Equal(defaultOpt, new Value(10), new Value(10))
        ])
      ],
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_XOR),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
        ],
        new Xor([
          new Equal(defaultOpt, new Value(5), new Value(5)),
          new Equal(defaultOpt, new Value(10), new Value(10))
        ])
      ],
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_NOT),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5]
        ],
        new Not(new Equal(defaultOpt, new Value(5), new Value(5)))
      ],
      // Not-nested, 2 items, reduced into comparison
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
        ],
        new Equal(defaultOpt, new Value(5), new Value(5)),
      ],
      // Not-nested, 2 items, reduced into logical
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
          ],
        ],
        new Or([
          new Equal(defaultOpt, new Value(5), new Value(5)),
          new Equal(defaultOpt, new Value(10), new Value(10))
        ])
      ],
      // Nested
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_AND),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
            [defaultOptions.operatorMapping.get(OPERATOR_EQ), 10, 10],
          ],
          [defaultOptions.operatorMapping.get(OPERATOR_EQ), 15, 15],
        ],
        new And([
          new Or([
            new Equal(defaultOpt, new Value(5), new Value(5)),
            new Equal(defaultOpt, new Value(10), new Value(10))
          ]),
          new Equal(defaultOpt, new Value(15), new Value(15))
        ])
      ],
      // Zero argument logical expression treated as collection
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_IN),
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR)
          ]
        ],
        new In(
          new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
          new Collection([new Value(defaultOptions.operatorMapping.get(OPERATOR_OR))])
        )
      ],
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_IN),
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            defaultOptions.operatorMapping.get(OPERATOR_AND)
          ]
        ],
        new In(
          new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
          new Collection([
            new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
            new Value(defaultOptions.operatorMapping.get(OPERATOR_AND))
          ])
        )
      ],
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_IN),
          defaultOptions.operatorMapping.get(OPERATOR_OR),
          [
            defaultOptions.operatorMapping.get(OPERATOR_OR),
            'AK',
            'MN'
          ]
        ],
        new In(
          new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
          new Collection([
            new Value(defaultOptions.operatorMapping.get(OPERATOR_OR)),
            new Value('AK'),
            new Value('MN')
          ])
        )
      ],
      // Not treated as raw array
      [
        [
          defaultOptions.operatorMapping.get(OPERATOR_NOT),
          5
        ],
        new Collection([
          new Value(defaultOptions.operatorMapping.get(OPERATOR_NOT)),
          new Value(5)
        ])
      ]
    ] as [ExpressionInput, Evaluable][])
      ('%p should evaluate as %p', (expression, expected) => {
        expect(parser.parse(expression)).toEqual(expected)
      })

    test.each([
      // Invalid form
      [[]],
      // Invalid operator, reduce-able expression
      [['__', ['==', 5, 5]]],
      // Invalid operator
      [['__', ['==', 5, 5], ['==', 5, 5]]],
      // Invalid logical inner expression
      [['IN', 'OR', ['OR', 'AND', [5, 5]]]],
    ] as [ExpressionInput][])
      ('%p should throw', (expression) => {
        expect(() => parser.parse(expression)).toThrowError()
      })
  })

  describe('parse - comparison expressions', () => {
    test.each([
      [
        [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, 5],
        new Equal(defaultOpt, new Value(5), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_NE), 5, 5],
        new NotEqual(defaultOpt, new Value(5), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_GT), 5, 5],
        new GreaterThan(defaultOpt, new Value(5), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_GE), 5, 5],
        new GreaterThanOrEqual(defaultOpt, new Value(5), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_LT), 5, 5],
        new LessThan(defaultOpt, new Value(5), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_LE), 5, 5],
        new LessThanOrEqual(defaultOpt, new Value(5), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_IN), 5, [5]],
        new In(new Value(5), new Collection([new Value(5)]))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_NOT_IN), 5, [5]],
        new NotIn(new Value(5), new Collection([new Value(5)]))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_PREFIX), 'a', 'abc'],
        new Prefix(new Value('a'), new Value('abc'))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_SUFFIX), 'abc', 'c'],
        new Suffix(new Value('abc'), new Value('c'))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_OVERLAP), ['a', 'b'], ['a']],
        new Overlap(new Collection([new Value('a'), new Value('b')]), new Collection([new Value('a')]))
      ],
      // Reference
      [
        [defaultOptions.operatorMapping.get(OPERATOR_EQ), '$RefA', 5],
        new Equal(defaultOpt, new Reference('RefA'), new Value(5))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_EQ), 5, '$RefA'],
        new Equal(defaultOpt, new Value(5), new Reference('RefA'))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_UNDEFINED), '$RefA'],
        new Undefined(new Reference('RefA'))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_PRESENT), '$RefA'],
        new Present(new Reference('RefA'))
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_OVERLAP), ['$RefA', '$RefB'], ['a']],
        new Overlap(
          new Collection([
            new Reference('RefA'),
            new Reference('RefB'),
          ]),
          new Collection([new Value('a')])
        )
      ],
      [
        [defaultOptions.operatorMapping.get(OPERATOR_PRESENT), '$RefA{RefB}'],
        new Present(new Reference('RefA{RefB}'))
      ]
    ] as [ExpressionInput, Evaluable][])
      ('%p should evaluate as %p', (expression, expected) => {
        expect(parser.parse(expression)).toEqual(expected)
      })

    test.each([
      // Invalid form
      [[]],
      // Invalid operator
      [['__', 5, 5]],
    ] as [ExpressionInput][])
      ('%p should throw', (expression) => {
        expect(() => parser.parse(expression)).toThrowError()
      })
  })
})
