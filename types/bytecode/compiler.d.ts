/**
 * Bytecode compiler.
 *
 * Transforms a raw ExpressionInput (plain array) into a flat Bytecode array
 * that the interpreter can execute. This runs once per unique expression;
 * the result should be cached and reused across evaluate() calls.
 */
import { Result } from '../common/evaluable.js';
import { ArrayInput, ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { CompactRef } from './refs.js';
export type Bytecode = (number | Result)[];
export interface CompiledExpression {
    bytecode: Bytecode;
    refs: CompactRef[];
    numLocals: number;
    consts: ArrayInput[];
}
/**
 * Compile a raw ExpressionInput into bytecode.
 * The result should be cached and reused across evaluate() calls.
 */
export declare function compile(raw: ExpressionInput, opts: Options): CompiledExpression;
