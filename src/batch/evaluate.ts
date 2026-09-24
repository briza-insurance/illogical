import { Context } from '../common/evaluable.js'
import { isBoolean } from '../common/type-check.js'
import { ExpressionInput } from '../parser/index.js'
import { ParsedBatch } from './types.js'

/**
 * Evaluate a single expression within a batch.
 *
 * @param batch — The ParsedBatch
 * @param expr — Name of the expression to evaluate
 * @param ctx — Evaluation context
 * @returns The computed Result
 */
export function evaluateSingle(
  batch: ParsedBatch,
  expr: ExpressionInput,
  ctx: Context
): boolean {
  const evaluable = batch.expressions.get(expr)
  if (!evaluable) {
    throw new Error(`Expression '${JSON.stringify(expr)}' not found in batch`)
  }

  const result = evaluable.evaluate(ctx)

  if (!isBoolean(result)) {
    throw new Error(
      `Unexpected result type for expression '${JSON.stringify(expr)}'`
    )
  }

  return result
}

/**
 * Evaluate expressions in a batch.
 *
 * Mode 1 (full evaluation): evaluates all expressions if no affectedExpressions set is provided.
 * Mode 2 (incremental): only evaluates expressions in affectedExpressions set.
 *
 * @param batch — The ParsedBatch
 * @param ctx — Evaluation context
 * @param affectedExpressions — If provided, only evaluate these expressions,
 *   otherwise evaluate all.
 * @returns Record mapping expression names to their Result values
 */
export function evaluateBatch(
  batch: ParsedBatch,
  ctx: Context,
  affectedExpressions?: Set<ExpressionInput>
): Map<ExpressionInput, boolean> {
  const results: Map<ExpressionInput, boolean> = new Map()

  if (affectedExpressions === undefined) {
    // Full evaluation: run all expressions
    for (const expr of batch.expressions.keys()) {
      results.set(expr, evaluateSingle(batch, expr, ctx))
    }
  } else {
    // Incremental evaluation: only run affected expressions
    for (const expr of affectedExpressions) {
      if (batch.expressions.has(expr)) {
        results.set(expr, evaluateSingle(batch, expr, ctx))
      } else {
        throw new Error(
          `Expression '${JSON.stringify(expr)}' not found in batch`
        )
      }
    }
  }

  return results
}
