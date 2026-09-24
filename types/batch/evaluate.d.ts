import { Context } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { ParsedBatch } from './types.js';
/**
 * Evaluate a single expression within a batch.
 *
 * @param batch — The ParsedBatch
 * @param expr — Name of the expression to evaluate
 * @param ctx — Evaluation context
 * @returns The computed Result
 */
export declare function evaluateSingle(batch: ParsedBatch, expr: ExpressionInput, ctx: Context): boolean;
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
export declare function evaluateBatch(batch: ParsedBatch, ctx: Context, affectedExpressions?: Set<ExpressionInput>): Map<ExpressionInput, boolean>;
