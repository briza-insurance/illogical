/**
 * Batch interpreter.
 *
 * Wraps the existing interpret() function from ../bytecode/interpreter.ts
 * but with shared lookup tables (refs, consts, constSets) and per-expression
 * locals offsets.
 *
 * The existing interpret() function's hot path remains unchanged — we
 * use a pre-built CompiledExpression object for each expression that was
 * constructed during compileBatch. This avoids object construction overhead
 * on every evaluation call.
 */

import { interpret as interpretOriginal } from '../bytecode/interpreter.js'
import { Context, Result } from '../common/evaluable.js'
import { CompiledBatch } from './types.js'

/**
 * Evaluate a single expression within a batch.
 *
 * Constructs a temporary CompiledExpression-compatible object that maps
 * to the batch's shared resources, then calls the existing interpret().
 *
 * @param batch — The compiled batch
 * @param exprName — Name of the expression to evaluate
 * @param ctx — Evaluation context
 * @returns The computed Result
 */
export function interpretSingle(
  batch: CompiledBatch,
  exprName: string,
  ctx: Context
): Result {
  const expr = batch.expressions.get(exprName)
  if (!expr) {
    throw new Error(`Expression '${exprName}' not found in batch`)
  }

  // Use the pre-built CompiledExpression wrapper — avoids object construction
  // on every evaluation call
  return interpretOriginal(expr.precompiled, ctx)
}

/**
 * Evaluate expressions in a batch.
 *
 * Mode 1 (full evaluation): runs all expressions, marks all clean.
 * Mode 2 (incremental): only runs expressions in dirtyExpressions set.
 *
 * @param batch — The compiled batch
 * @param ctx — Evaluation context
 * @param dirtyExpressions — If provided, only evaluate these expressions; otherwise evaluate all
 * @returns Record mapping expression names to their Result values
 */
export function interpretBatch(
  batch: CompiledBatch,
  ctx: Context,
  dirtyExpressions?: Set<string>
): Record<string, Result> {
  const results: Record<string, Result> = {}

  if (dirtyExpressions === undefined) {
    // Full evaluation: run all expressions
    for (const exprName of batch.expressions.keys()) {
      results[exprName] = interpretSingle(batch, exprName, ctx)
      batch.expressions.get(exprName)!.dirty = false
    }
  } else {
    // Incremental evaluation: only run dirty expressions
    for (const exprName of dirtyExpressions) {
      if (batch.expressions.has(exprName)) {
        results[exprName] = interpretSingle(batch, exprName, ctx)
        batch.expressions.get(exprName)!.dirty = false
      }
    }
  }

  return results
}
