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
 * Mode 1 (full evaluation): evaluates all expressions if no affectedExpressions
 *   set is provided.
 * Mode 2 (incremental): only evaluates expressions in affectedExpressions set.
 *
 * @param expressions — Set of all expression inputs in the batch
 * @param batch — The ParsedBatch
 * @param ctx — Evaluation context
 * @param affectedExpressions — If provided, only evaluate these expressions,
 *   otherwise evaluate all.
 * @returns A generator yielding tuples of expression input and its boolean result
 */
export declare function evaluateBatch(expressions: Set<ExpressionInput>, batch: ParsedBatch, ctx: Context, affectedExpressions?: Set<ExpressionInput>): Generator<[ExpressionInput, boolean], void, unknown>;
