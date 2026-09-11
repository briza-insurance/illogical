import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine, {
  defaultOptions,
  type ExpressionInput,
  Input,
} from '../../index.js'
import { Options } from '../../parser/options.js'

export const testCases: { expression: ExpressionInput; string: string }[] = [
  // Comparison: Equal
  {
    expression: ['==', 'a', 'b'],
    string: '("a" == "b")',
  },
  {
    expression: ['==', '$Ref1', 'b'],
    string: '({Ref1} == "b")',
  },
  {
    expression: ['==', 'a', '$Ref2'],
    string: '("a" == {Ref2})',
  },
  {
    expression: ['==', 1, 1],
    string: '(1 == 1)',
  },
  {
    expression: ['==', true, false],
    string: '(true == false)',
  },
  {
    expression: ['==', null, null],
    string: '(null == null)',
  },
  {
    expression: ['==', '$tags', ['admin', 'manager']],
    string: '({tags} == ["admin", "manager"])',
  },
  {
    expression: ['==', ['admin', 'manager'], '$tags'],
    string: '(["admin", "manager"] == {tags})',
  },
  {
    expression: ['==', '$Address.state', 'NY'],
    string: '({Address.state} == "NY")',
  },
  {
    expression: ['==', '$Address.{prop}', 'NY'],
    string: '({Address.{prop}} == "NY")',
  },
  {
    expression: ['==', '$Limit.(Number)', 1000],
    string: '({Limit} == 1000)',
  },

  // Comparison: Not Equal
  {
    expression: ['!=', 'a', 'b'],
    string: '("a" != "b")',
  },
  {
    expression: ['!=', '$Ref1', 10],
    string: '({Ref1} != 10)',
  },
  {
    expression: ['!=', [1, 2], '$list'],
    string: '([1, 2] != {list})',
  },

  // Comparison: Greater Than / Greater Than Or Equal
  {
    expression: ['>', '$age', 18],
    string: '({age} > 18)',
  },
  {
    expression: ['>=', '$score', 50],
    string: '({score} >= 50)',
  },

  // Comparison: Less Than / Less Than Or Equal
  {
    expression: ['<', '$price', 100],
    string: '({price} < 100)',
  },
  {
    expression: ['<=', '$temperature', 0],
    string: '({temperature} <= 0)',
  },

  // Comparison: In / Not In
  {
    expression: ['IN', '$role', ['admin', 'manager']],
    string: '({role} in ["admin", "manager"])',
  },
  {
    expression: ['IN', 'active', ['$status1', '$status2']],
    string: '("active" in [{status1}, {status2}])',
  },
  {
    expression: ['IN', '$role', ['$status1', '$status2']],
    string: '({role} in [{status1}, {status2}])',
  },
  {
    expression: ['IN', '$role', '$allowedRoles'],
    string: '({role} in {allowedRoles})',
  },
  {
    expression: ['IN', 'admin', '$allowedRoles'],
    string: '("admin" in {allowedRoles})',
  },
  {
    expression: ['IN', [1, 2], '$nestedList'],
    string: '({nestedList} in [1, 2])',
  },
  {
    expression: ['IN', ['$ref1', '$ref2'], 'ref3'],
    string: '("ref3" in [{ref1}, {ref2}])',
  },
  {
    expression: ['NOT IN', '$country', ['US', 'CA', 'MX']],
    string: '({country} not in ["US", "CA", "MX"])',
  },
  {
    expression: ['NOT IN', 'active', ['$status1', '$status2']],
    string: '("active" not in [{status1}, {status2}])',
  },
  {
    expression: ['NOT IN', '$role', ['$status1', '$status2']],
    string: '({role} not in [{status1}, {status2}])',
  },
  {
    expression: ['NOT IN', ['basic', 'trial'], '$tier'],
    string: '({tier} not in ["basic", "trial"])',
  },
  {
    expression: ['NOT IN', ['$role1', '$role2'], '$tier'],
    string: '({tier} not in [{role1}, {role2}])',
  },
  {
    expression: ['NOT IN', '$tier', '$allowedTiers'],
    string: '({tier} not in {allowedTiers})',
  },
  {
    expression: ['NOT IN', ['$ref1', '$ref2'], 'ref3'],
    string: '("ref3" not in [{ref1}, {ref2}])',
  },

  // Comparison: Prefix / Suffix
  {
    expression: ['PREFIX', '$code', 'PRX-'],
    string: '(<{code}>"PRX-")',
  },
  {
    expression: ['SUFFIX', '$filename', '.json'],
    string: '({filename}<".json">)',
  },

  // Comparison: Overlap
  {
    expression: ['OVERLAP', '$userTags', ['admin', 'moderator']],
    string: '({userTags} overlap ["admin", "moderator"])',
  },
  {
    // isStaticCollection left + isPureRefCollection right
    expression: ['OVERLAP', ['a', 'b'], ['$c', '$d']],
    string: '(["a", "b"] overlap [{c}, {d}])',
  },
  {
    // isStaticCollection left + not isPureRefCollection right
    expression: ['OVERLAP', ['a', 'b'], ['$c', 'd']],
    string: '(["a", "b"] overlap [{c}, "d"])',
  },
  {
    // isStaticCollection right + isPureRefCollection left
    expression: ['OVERLAP', ['$a', '$b'], ['c', 'd']],
    string: '([{a}, {b}] overlap ["c", "d"])',
  },
  {
    expression: ['==', ['$a', '$b'], ['$c', '$d']],
    string: '([{a}, {b}] == [{c}, {d}])',
  },
  {
    // Reuse identical dynamic collection to trigger dynamic collection CSE (OP_LOAD_LOCAL)
    expression: ['==', ['$a', '$b'], ['$a', '$b']],
    string: '([{a}, {b}] == [{a}, {b}])',
  },

  // Comparison: In
  {
    expression: ['IN', '$tier', ['basic', 'trial']],
    string: '({tier} in ["basic", "trial"])',
  },
  {
    expression: ['IN', ['basic', 'trial'], '$tier'],
    string: '({tier} in ["basic", "trial"])',
  },

  // Presence: Present / Undefined
  {
    expression: ['PRESENT', '$optionalField'],
    string: '({optionalField} is PRESENT)',
  },
  {
    expression: ['UNDEFINED', '$missingField'],
    string: '({missingField} is UNDEFINED)',
  },

  // Arithmetic: Sum, Subtract, Multiply, Divide
  {
    expression: ['==', ['+', 1, 2], 3],
    string: '((1 + 2) == 3)',
  },
  {
    expression: ['==', ['+', '$a', '$b', 10], 100],
    string: '(({a} + {b} + 10) == 100)',
  },
  {
    expression: ['==', ['-', 10, 5], 5],
    string: '((10 - 5) == 5)',
  },
  {
    expression: ['==', ['-', '$total', '$discount'], 0],
    string: '(({total} - {discount}) == 0)',
  },
  {
    expression: ['==', ['*', 2, 3], 6],
    string: '((2 * 3) == 6)',
  },
  {
    expression: ['==', ['*', '$qty', '$unitPrice'], 50],
    string: '(({qty} * {unitPrice}) == 50)',
  },
  {
    expression: ['==', ['/', 10, 2], 5],
    string: '((10 / 2) == 5)',
  },
  {
    expression: ['==', ['/', '$total', '$count'], 2.5],
    string: '(({total} / {count}) == 2.5)',
  },

  // Logical: NOT
  {
    expression: ['NOT', ['==', '$status', 'inactive']],
    string: '(({status} == "inactive"))',
  },

  // Logical: AND
  {
    expression: ['AND', ['==', '$a', 1], ['==', '$b', 2]],
    string: '(({a} == 1) AND ({b} == 2))',
  },
  {
    // Reuse identical dynamic collection across operands (OP_LOAD_LOCAL)
    expression: [
      'AND',
      ['==', '$x', ['$ref1', '$ref2']],
      ['==', '$y', ['$ref1', '$ref2']],
    ],
    string: '(({x} == [{ref1}, {ref2}]) AND ({y} == [{ref1}, {ref2}]))',
  },
  {
    expression: [
      'AND',
      ['>=', '$age', 18],
      ['<', '$age', 65],
      ['==', '$country', 'US'],
    ],
    string: '(({age} >= 18) AND ({age} < 65) AND ({country} == "US"))',
  },

  // Logical: OR
  {
    expression: ['OR', ['==', '$role', 'admin'], ['==', '$role', 'owner']],
    string: '(({role} == "admin") OR ({role} == "owner"))',
  },
  {
    expression: [
      'OR',
      ['==', '$type', 'A'],
      ['==', '$type', 'B'],
      ['==', '$type', 'C'],
    ],
    string: '(({type} == "A") OR ({type} == "B") OR ({type} == "C"))',
  },

  // Logical: NOR
  {
    expression: ['NOR', ['==', '$a', 1], ['==', '$b', 2]],
    string: '(({a} == 1) NOR ({b} == 2))',
  },
  {
    expression: ['NOR', ['==', '$x', 0], ['==', '$y', 0], ['==', '$z', 0]],
    string: '(({x} == 0) NOR ({y} == 0) NOR ({z} == 0))',
  },

  // Logical: XOR
  {
    expression: ['XOR', ['==', '$flagA', true], ['==', '$flagB', true]],
    string: '(({flagA} == true) XOR ({flagB} == true))',
  },
  {
    expression: [
      'XOR',
      ['==', '$a', true],
      ['==', '$b', true],
      ['==', '$c', true],
    ],
    string: '(({a} == true) XOR ({b} == true) XOR ({c} == true))',
  },

  // Nested Logical & Mixed Expressions
  {
    expression: [
      'AND',
      ['OR', ['==', '$status', 'active'], ['==', '$status', 'pending']],
      ['NOT', ['IN', '$tier', ['basic', 'trial']]],
    ],
    string:
      '((({status} == "active") OR ({status} == "pending")) AND (({tier} in ["basic", "trial"])))',
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
    string:
      '(({Question1} == "val1") AND ({Question2} == "val2") ' +
      'AND ((({Question2} == "val2") AND ({Question3} == "val3")) ' +
      'OR (({Question2} == "val2") AND ({Question3} == "val4"))))',
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
