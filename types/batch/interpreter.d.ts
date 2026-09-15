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
import { Context, Result } from '../common/evaluable.js';
import { CompiledBatch } from './types.js';
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
export declare function interpretSingle(batch: CompiledBatch, exprName: string, ctx: Context): Result;
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
export declare function interpretBatch(batch: CompiledBatch, ctx: Context, dirtyExpressions?: Set<string>): Record<string, Result>;
