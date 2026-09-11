import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine, { defaultOptions, type ExpressionInput } from '../../index.js'

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

  // Comparison: Not Equal
  {
    expression: ['!=', 'a', 'b'],
  },
  {
    expression: ['!=', '$Ref1', 10],
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
    expression: ['NOT IN', '$country', ['US', 'CA', 'MX']],
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
    expression: ['OVERLAP', ['a', 'b'], ['$c', '$d']],
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
]

// TODO: uncomment oop
for (const mode of [/*'oop',*/ 'bytecode'] as const) {
  describe('Serialize', () => {
    const engine = new Engine({ evaluator: mode })

    for (const tc of testCases) {
      test(`[${mode}] serializing: ${JSON.stringify(tc.expression)}`, () => {
        const evaluable = engine.parse(tc.expression)

        const serialized = evaluable.serialize(defaultOptions)
        console.log('serialized', serialized)

        assert.deepStrictEqual(
          JSON.stringify(serialized),
          JSON.stringify(tc.expression),
          `[${mode}] Expected serialize to return ${JSON.stringify(tc.expression)}, got ${JSON.stringify(serialized)}`
        )
      })
    }
  })
}
