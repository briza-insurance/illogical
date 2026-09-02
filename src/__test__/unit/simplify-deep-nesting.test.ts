import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import type { ContextValue } from '../../common/evaluable.js'
import Engine, {
  type Context,
  type ExpressionInput,
  type Input,
} from '../../index.js'

/**
 * Generality of the bytecode `simplify` for OR/AND nesting depth.
 *
 * The regression fixed by this change was the simplify merge optimization
 * collapsing nested OR/AND structure. That optimization was skipped for
 * simplify, so reconstruction falls back to the general short-circuit path,
 * which handles arbitrary nesting depth. The old merge only reconstructed the
 * specific 2-level `OR(AND(ref1,ref2), …)` shape.
 *
 * This suite locks in that the fix is *generic* (not limited to 2 or 3 levels):
 *   1. bytecode simplify reproduces the OOP simplify verbatim for deep spirals
 *      and wide merges (structural, instant);
 *   2. the simplified form never changes the evaluated truth table for several
 *      depths (behavioral, bounded completions — kept shallow to stay fast).
 */

const leaf = (ref: string, val: Input): ExpressionInput =>
  ['==', '$' + ref, val] as ExpressionInput

// Alternating OR/AND "spiral": wrap the previous structure, then add leaves.
// depth == nesting depth of the OR/AND alternation.
const buildSpiral = (depth: number): ExpressionInput => {
  let cur: ExpressionInput = leaf('r0', 0)
  for (let d = 1; d <= depth; d++) {
    const op = d % 2 === 1 ? 'OR' : 'AND'
    cur = [
      op,
      cur,
      leaf('a' + d, d),
      leaf('b' + d, d * 2 + 1),
    ] as ExpressionInput
  }
  return cur
}

const buildWideMerge = (branches: number): ExpressionInput => {
  const bs: ExpressionInput[] = []
  for (let k = 0; k < branches; k++) {
    bs.push(['AND', ['==', '$shared', k], leaf('w' + k, k)] as ExpressionInput)
  }
  return ['OR', ...bs] as ExpressionInput
}

const oop = new Engine({ evaluator: 'oop' })
const bytecode = new Engine({ evaluator: 'bytecode' })

// (1) Structural: bytecode must reproduce the OOP simplify verbatim at every
// tested depth / branch count. Instant.
for (let depth = 2; depth <= 10; depth++) {
  test(`simplify reproduces OOP verbatim for deep spiral depth ${depth}`, () => {
    const exp = buildSpiral(depth)
    const ctx: Context = { r0: 5 }
    assert.deepStrictEqual(bytecode.simplify(exp, ctx), oop.simplify(exp, ctx))
  })
}

for (let branches = 2; branches <= 8; branches++) {
  test(`simplify reproduces OOP verbatim for wide merge (${branches} branches)`, () => {
    const exp = buildWideMerge(branches)
    const ctx: Context = { r0: 5 }
    assert.deepStrictEqual(bytecode.simplify(exp, ctx), oop.simplify(exp, ctx))
  })
}

// (2) Behavioral: the simplified form must never change the evaluated truth
// table. Bounded completions, kept shallow (depth <= 3) so the suite stays fast.
const DOMAIN: ContextValue[] = [undefined, null, 1, 2, 3, 100, -5]

function assertEvalEquivalent(exp: ExpressionInput, maxDepth: number): void {
  const ctx = { r0: 5 }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const oopSimp = oop.simplify(exp, ctx) as ExpressionInput
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const bcSimp = bytecode.simplify(exp, ctx) as ExpressionInput

  const refs = new Set<string>()
  const walk = (e: unknown): void => {
    if (Array.isArray(e)) {
      for (const x of e) {
        walk(x)
      }
    } else if (typeof e === 'string' && e[0] === '$' && e.slice(1) !== 'r0') {
      refs.add(e.slice(1))
    }
  }
  walk(exp)
  const list = [...refs]

  let checked = 0
  let mismatches = 0
  const rec = (i: number, cur: Context): void => {
    if (i === list.length) {
      checked++
      const o = oop.evaluate(exp, cur)
      const oo = oop.evaluate(oopSimp, cur)
      const b = bytecode.evaluate(exp, cur)
      const bb = bytecode.evaluate(bcSimp, cur)
      if (!(o === b && o === oo && o === bb)) {
        mismatches++
      }
      return
    }
    for (const v of DOMAIN) {
      cur[list[i]] = v
      rec(i + 1, cur)
    }
  }
  rec(0, { ...ctx })
  const msg =
    `${checked} completions checked; ` +
    `${mismatches} eval-mismatches ` +
    `(bytecode simplify changed behavior at depth ${maxDepth})`
  assert.strictEqual(mismatches, 0, msg)
}

for (let depth = 2; depth <= 3; depth++) {
  test(`simplify preserves evaluation semantics for deep spiral depth ${depth}`, () => {
    assertEvalEquivalent(buildSpiral(depth), depth)
  })
}
