/**
 * Bytecode interpreter.
 *
 * Executes a compiled bytecode array against a context object.
 * Zero allocations in the hot path: uses a pre-allocated stack
 * and operates on the flat bytecode array directly.
 */
import { Context, Result } from '../common/evaluable.js';
import { CompiledExpression } from './compiler.js';
/**
 * Execute compiled bytecode against a context.
 * Returns the top-of-stack value when execution completes.
 */
export declare function interpret(compiled: CompiledExpression, ctx: Context): Result;
