/**
 * Bytecode interpreter.
 *
 * Executes a compiled bytecode array against a context object.
 * Zero allocations in the hot path: uses a pre-allocated stack
 * and operates on the flat bytecode array directly.
 */
import { Context, Result } from '../common/evaluable.js';
import { CompiledExpression } from './compiler.js';
export declare function interpret(compiled: CompiledExpression, ctx: Context): Result;
