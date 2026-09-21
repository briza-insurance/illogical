import { Context, Result } from '../common/evaluable.js'
import { ParsedBatch } from './types.js'

/**
 * Evaluate a single expression within a batch.
 *
 * @param batch — The ParsedBatch
 * @param exprName — Name of the expression to evaluate
 * @param ctx — Evaluation context
 * @returns The computed Result
 */
export function evaluateSingle(
  batch: ParsedBatch,
  exprName: string,
  ctx: Context
): Result {
  const evaluable = batch.expressions.get(exprName)
  if (!evaluable) {
    throw new Error(`Expression '${exprName}' not found in batch`)
  }

  return evaluable.evaluate(ctx)
}

/**
 * Evaluate expressions in a batch.
 *
 * Mode 1 (full evaluation): evaluates all expressions.
 * Mode 2 (incremental): only evaluates expressions in dirtyExpressions set.
 *
 * @param batch — The ParsedBatch
 * @param ctx — Evaluation context
 * @param dirtyExpressions — If provided, only evaluate these expressions,
 *   otherwise evaluate all.
 * @returns Record mapping expression names to their Result values
 */
export function evaluateBatch(
  batch: ParsedBatch,
  ctx: Context,
  dirtyExpressions?: Set<string>
): Record<string, Result> {
  const results: Record<string, Result> = {}

  if (dirtyExpressions === undefined) {
    // Full evaluation: run all expressions
    for (const exprName of batch.expressions.keys()) {
      results[exprName] = evaluateSingle(batch, exprName, ctx)
    }
  } else {
    // Incremental evaluation: only run dirty expressions
    for (const exprName of dirtyExpressions) {
      if (batch.expressions.has(exprName)) {
        results[exprName] = evaluateSingle(batch, exprName, ctx)
      } else {
        throw new Error(`Expression '${exprName}' not found in batch`)
      }
    }
  }

  return results
}
