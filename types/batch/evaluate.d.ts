import { Context } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { ParsedBatch } from './types.js';
/**
 * Evaluate expressions in a batch.
 *
 * Mode 1 (full evaluation): evaluates all expressions if affectedExpressions
 *   not provided.
 * Mode 2 (incremental): only evaluates expressions in affectedExpressions.
 *
 * @param expressions — Array containing all expression inputs in the batch
 * @param batch — The ParsedBatch
 * @param ctx — Evaluation context
 * @param affectedExpressions — If provided, only evaluate these expressions,
 *   otherwise evaluate all.
 * @returns A generator yielding tuples of expression input and its boolean result
 */
export declare function evaluateBatch(expressions: ExpressionInput[], batch: ParsedBatch, ctx: Context, affectedExpressions?: ExpressionInput[]): Generator<[ExpressionInput, boolean], void, unknown>;
