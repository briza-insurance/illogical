import { Context, Result } from '../common/evaluable.js';
import { ParsedBatch } from './types.js';
/**
 * Evaluate a single expression within a batch.
 *
 * @param batch — The ParsedBatch
 * @param exprName — Name of the expression to evaluate
 * @param ctx — Evaluation context
 * @returns The computed Result
 */
export declare function evaluateSingle(batch: ParsedBatch, exprName: string, ctx: Context): Result;
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
export declare function evaluateBatch(batch: ParsedBatch, ctx: Context, affectedExpressions?: Set<string>): Record<string, Result>;
