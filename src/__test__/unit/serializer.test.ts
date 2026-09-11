import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine, {
  defaultOptions,
  type ExpressionInput,
  Input,
} from '../../index.js'
import { Options } from '../../parser/options.js'

const testCases: { expression: ExpressionInput }[] = [
  // Comparison: Equal
  {
    expression: ['==', 'a', 'b'],
  },
  {
    expression: ['==', '$Ref1', 'b'],
  },
  {
    expression: ['==', 'a', '$Ref2'],
  },
  {
    expression: ['==', 1, 1],
  },
  {
    expression: ['==', true, false],
  },
  {
    expression: ['==', null, null],
  },
  {
    expression: ['==', '$tags', ['admin', 'manager']],
  },
  {
    expression: ['==', ['admin', 'manager'], '$tags'],
  },
  {
    expression: ['==', '$Address.state', 'NY'],
  },
  {
    expression: ['==', '$Address.{prop}', 'NY'],
  },
  {
    expression: ['==', '$Limit.(Number)', 1000],
  },

  // Comparison: Not Equal
  {
    expression: ['!=', 'a', 'b'],
  },
  {
    expression: ['!=', '$Ref1', 10],
  },
  {
    expression: ['!=', [1, 2], '$list'],
  },

  // Comparison: Greater Than / Greater Than Or Equal
  {
    expression: ['>', '$age', 18],
  },
  {
    expression: ['>=', '$score', 50],
  },

  // Comparison: Less Than / Less Than Or Equal
  {
    expression: ['<', '$price', 100],
  },
  {
    expression: ['<=', '$temperature', 0],
  },

  // Comparison: In / Not In
  {
    expression: ['IN', '$role', ['admin', 'manager']],
  },
  {
    expression: ['IN', 'active', ['$status1', '$status2']],
  },
  {
    expression: ['IN', '$role', ['$status1', '$status2']],
  },
  {
    expression: ['IN', '$role', '$allowedRoles'],
  },
  {
    expression: ['IN', 'admin', '$allowedRoles'],
  },
  {
    expression: ['IN', [1, 2], '$nestedList'],
  },
  {
    expression: ['IN', ['$ref1', '$ref2'], 'ref3'],
  },
  {
    expression: ['NOT IN', '$country', ['US', 'CA', 'MX']],
  },
  {
    expression: ['NOT IN', 'active', ['$status1', '$status2']],
  },
  {
    expression: ['NOT IN', '$role', ['$status1', '$status2']],
  },
  {
    expression: ['NOT IN', ['basic', 'trial'], '$tier'],
  },
  {
    expression: ['NOT IN', ['$role1', '$role2'], '$tier'],
  },
  {
    expression: ['NOT IN', '$tier', '$allowedTiers'],
  },
  {
    expression: ['NOT IN', ['$ref1', '$ref2'], 'ref3'],
  },

  // Comparison: Prefix / Suffix
  {
    expression: ['PREFIX', '$code', 'PRX-'],
  },
  {
    expression: ['SUFFIX', '$filename', '.json'],
  },

  // Comparison: Overlap
  {
    expression: ['OVERLAP', '$userTags', ['admin', 'moderator']],
  },
  {
    // isStaticCollection left + isPureRefCollection right
    expression: ['OVERLAP', ['a', 'b'], ['$c', '$d']],
  },
  {
    // isStaticCollection left + not isPureRefCollection right
    expression: ['OVERLAP', ['a', 'b'], ['$c', 'd']],
  },
  {
    // isStaticCollection right + isPureRefCollection left
    expression: ['OVERLAP', ['$a', '$b'], ['c', 'd']],
  },
  {
    expression: ['==', ['$a', '$b'], ['$c', '$d']],
  },
  {
    // Reuse identical dynamic collection to trigger dynamic collection CSE (OP_LOAD_LOCAL)
    expression: ['==', ['$a', '$b'], ['$a', '$b']],
  },

  // Comparison: In
  {
    expression: ['IN', '$tier', ['basic', 'trial']],
  },
  {
    expression: ['IN', ['basic', 'trial'], '$tier'],
  },

  // Presence: Present / Undefined
  {
    expression: ['PRESENT', '$optionalField'],
  },
  {
    expression: ['UNDEFINED', '$missingField'],
  },

  // Arithmetic: Sum, Subtract, Multiply, Divide
  {
    expression: ['==', ['+', 1, 2], 3],
  },
  {
    expression: ['==', ['+', '$a', '$b', 10], 100],
  },
  {
    expression: ['==', ['-', 10, 5], 5],
  },
  {
    expression: ['==', ['-', '$total', '$discount'], 0],
  },
  {
    expression: ['==', ['*', 2, 3], 6],
  },
  {
    expression: ['==', ['*', '$qty', '$unitPrice'], 50],
  },
  {
    expression: ['==', ['/', 10, 2], 5],
  },
  {
    expression: ['==', ['/', '$total', '$count'], 2.5],
  },

  // Logical: NOT
  {
    expression: ['NOT', ['==', '$status', 'inactive']],
  },

  // Logical: AND
  {
    expression: ['AND', ['==', '$a', 1], ['==', '$b', 2]],
  },
  {
    // Reuse identical dynamic collection across operands (OP_LOAD_LOCAL)
    expression: [
      'AND',
      ['==', '$x', ['$ref1', '$ref2']],
      ['==', '$y', ['$ref1', '$ref2']],
    ],
  },
  {
    expression: [
      'AND',
      ['>=', '$age', 18],
      ['<', '$age', 65],
      ['==', '$country', 'US'],
    ],
  },

  // Logical: OR
  {
    expression: ['OR', ['==', '$role', 'admin'], ['==', '$role', 'owner']],
  },
  {
    expression: [
      'OR',
      ['==', '$type', 'A'],
      ['==', '$type', 'B'],
      ['==', '$type', 'C'],
    ],
  },

  // Logical: NOR
  {
    expression: ['NOR', ['==', '$a', 1], ['==', '$b', 2]],
  },
  {
    expression: ['NOR', ['==', '$x', 0], ['==', '$y', 0], ['==', '$z', 0]],
  },

  // Logical: XOR
  {
    expression: ['XOR', ['==', '$flagA', true], ['==', '$flagB', true]],
  },
  {
    expression: [
      'XOR',
      ['==', '$a', true],
      ['==', '$b', true],
      ['==', '$c', true],
    ],
  },

  // Nested Logical & Mixed Expressions
  {
    expression: [
      'AND',
      ['OR', ['==', '$status', 'active'], ['==', '$status', 'pending']],
      ['NOT', ['IN', '$tier', ['basic', 'trial']]],
    ],
  },

  // Nested AND with OR
  {
    expression: [
      'AND',
      ['==', '$Question1', 'val1'],
      ['==', '$Question2', 'val2'],
      [
        'OR',
        ['AND', ['==', '$Question2', 'val2'], ['==', '$Question3', 'val3']],
        ['AND', ['==', '$Question2', 'val2'], ['==', '$Question3', 'val4']],
      ],
    ],
  },
]

for (const mode of ['oop', 'bytecode'] as const) {
  describe('Serialize', () => {
    const engine = new Engine({ evaluator: mode })

    for (const tc of testCases) {
      test(`[${mode}] serializing: ${JSON.stringify(tc.expression)}`, () => {
        const evaluable = engine.parse(tc.expression)

        const serialized = evaluable.serialize(defaultOptions)

        assert.deepStrictEqual(
          JSON.stringify(serialized),
          JSON.stringify(tc.expression),
          `[${mode}] Expected serialize to return ${JSON.stringify(tc.expression)}, got ${JSON.stringify(serialized)}`
        )
      })
    }
  })
}

const updateRefSymbol = (
  expression: ExpressionInput | Input
): ExpressionInput | Input =>
  Array.isArray(expression)
    ? expression.map((item) => {
        if (typeof item === 'string' && item.startsWith('$')) {
          return '#' + item.slice(1)
        }
        if (Array.isArray(item)) {
          return updateRefSymbol(item)
        }
        return item
      })
    : expression

const referencePredicate = (key: unknown): boolean => {
  return typeof key === 'string' && key[0] === '#'
}

const referenceTransform = (key: string): string => {
  return key.slice(1)
}

const referenceSerialization = (key: string): string => {
  return `#${key}`
}
const isExpressionInput = (
  exp: ExpressionInput | Input
): exp is ExpressionInput => Array.isArray(exp)

for (const mode of ['oop', 'bytecode'] as const) {
  describe('Serialize with custom options', () => {
    const options: Partial<Options> = {
      evaluator: mode,
      referencePredicate,
      referenceTransform,
      referenceSerialization,
    }

    const engine = new Engine(options)

    for (const tc of testCases) {
      const updatedExpression = updateRefSymbol(tc.expression)

      if (!isExpressionInput(updatedExpression)) {
        assert.fail('Unexpected non ExpressionInput')
      }

      test(`[${mode}] serializing: ${JSON.stringify(updatedExpression)}`, () => {
        const evaluable = engine.parse(updatedExpression)

        const serialized = evaluable.serialize({
          ...defaultOptions,
          ...options,
        })

        assert.deepStrictEqual(
          JSON.stringify(serialized),
          JSON.stringify(updatedExpression),
          `[${mode}] Expected serialize to return ` +
            `${JSON.stringify(updatedExpression)}, got ${JSON.stringify(serialized)}`
        )
      })
    }
  })
}
