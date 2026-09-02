import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import type { ContextValue } from '../../common/evaluable.js'
import Engine, { type Context, type ExpressionInput } from '../../index.js'

/**
 * Behavioural (evaluation-equivalence) property tests for the bytecode
 * `simplify` of OR(AND(ref1, ref2), …) style conditions.
 *
 * The canonical structural-fidelity regressions for these patterns live in the
 * data-driven suite as conditions `249-and-or-eqs.json`, `250-or-and-in.json`
 * and `251-or-and-in-mixed-eq-in.json` (they assert exact expected output for
 * both evaluators). The bug those guard against — an operand being dropped or
 * mis-merged during simplify — is a *behavioural* regression, so this suite
 * additionally verifies the stronger property that `simplify` never changes the
 * evaluated truth table: for every context completion, the original expression,
 * the OOP-simplified form and the bytecode-simplified form must all agree.
 *
 * This catches a simplify that is structurally odd but behaviourally wrong, or
 * one that silently drops an operand (changing the result), even when it does
 * not match one of the hardcoded expected shapes.
 */

interface Case {
  description: string
  expression: ExpressionInput
}

const CASES: Case[] = [
  {
    description:
      'two branches sharing ref1 value (the classic drop/merge scenario)',
    expression: [
      'OR',
      ['AND', ['==', '$a', 1], ['==', '$b', 3]],
      ['AND', ['==', '$a', 1], ['==', '$b', 4]],
    ],
  },
  {
    description: 'nested AND wrapping the OR (Loss1PropertyRestored shape)',
    expression: [
      'AND',
      ['AND', ['==', '$LossHasAny', 'yes'], ['==', '$Loss1Type', 'property']],
      [
        'OR',
        [
          'AND',
          ['==', '$Loss1Type', 'property'],
          ['==', '$Loss1ClaimStatus', 'closed'],
        ],
        [
          'AND',
          ['==', '$Loss1Type', 'property'],
          ['==', '$Loss1ClaimStatus', 'declined'],
        ],
      ],
    ],
  },
  {
    description: 'distinct ref1 values keep both OR branches',
    expression: [
      'OR',
      ['AND', ['==', '$a', 1], ['==', '$b', 3]],
      ['AND', ['==', '$a', 2], ['==', '$b', 4]],
    ],
  },
  {
    description: 'mixed == and IN ref2 operators',
    expression: [
      'OR',
      [
        'AND',
        ['==', '$Loss1Type', 'property'],
        ['==', '$Loss1ClaimStatus', 'closed'],
      ],
      [
        'AND',
        ['IN', '$Loss1Type', ['property', 'home']],
        ['==', '$Loss1ClaimStatus', 'declined'],
      ],
    ],
  },
  {
    description: 'three-way OR sharing ref1 with a merged IN set',
    expression: [
      'OR',
      ['AND', ['IN', '$a', [1, 2]], ['==', '$b', 'x']],
      ['AND', ['IN', '$a', [1, 2]], ['==', '$b', 'y']],
      ['AND', ['IN', '$a', [1, 2]], ['==', '$b', 'z']],
    ],
  },
]

const oop = new Engine({ evaluator: 'oop' })
const bytecode = new Engine({ evaluator: 'bytecode' })

// Collect the (unique) top-level ref keys referenced by an expression.
function collectRefs(exp: unknown, acc: string[] = []): string[] {
  if (Array.isArray(exp)) {
    for (const item of exp) {
      collectRefs(item, acc)
    }
    return acc
  }
  if (typeof exp === 'string' && exp.startsWith('$')) {
    const key = exp.slice(1)
    if (!acc.includes(key)) {
      acc.push(key)
    }
  }
  return acc
}

// A representative value domain for the truth table (undefined => "absent").
const DOMAIN: ContextValue[] = [
  undefined,
  null,
  'yes',
  'no',
  'property',
  'closed',
  'declined',
  'home',
  'x',
  'y',
  'z',
  1,
  2,
  3,
]

function assertEvalEquivalent(exp: ExpressionInput): void {
  const refs = collectRefs(exp)
  let contexts = 0
  let mismatches = 0

  // The simplified forms depend only on the expression (and fixed context),
  // so compute them once and re-evaluate across every context completion.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const oopSimp = oop.simplify(exp, {}) as ExpressionInput
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const bcSimp = bytecode.simplify(exp, {}) as ExpressionInput

  const visit = (depth: number, cur: Context): void => {
    if (depth === refs.length) {
      contexts++
      const oopExp = oop.evaluate(exp, cur)
      const bcExp = bytecode.evaluate(exp, cur)
      const oopSimpVal = oop.evaluate(oopSimp, cur)
      const bcSimpVal = bytecode.evaluate(bcSimp, cur)
      // The original and both simplifications must agree on every completion.
      if (
        !(oopExp === bcExp && oopExp === oopSimpVal && oopExp === bcSimpVal)
      ) {
        mismatches++
        if (mismatches <= 5) {
          console.log(
            '  eval-mismatch @',
            JSON.stringify(cur),
            'exp_oop',
            oopExp,
            'exp_bc',
            bcExp,
            'simp_oop',
            oopSimpVal,
            'simp_bc',
            bcSimpVal
          )
        }
      }
      return
    }
    for (const v of DOMAIN) {
      cur[refs[depth]] = v
      visit(depth + 1, cur)
    }
  }

  visit(0, {})
  assert.strictEqual(
    mismatches,
    0,
    `${contexts} contexts evaluated; ${mismatches} eval-mismatches for ${JSON.stringify(
      exp
    )}`
  )
}

for (const tc of CASES) {
  test(`eval-equivalence: ${tc.description}`, () => {
    assertEvalEquivalent(tc.expression)
  })
}
