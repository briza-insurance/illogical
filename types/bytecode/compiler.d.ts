/**
 * Bytecode compiler.
 *
 * Transforms a raw ExpressionInput (plain array) into a flat Bytecode array
 * that the interpreter can execute. This runs once per unique expression;
 * the result should be cached and reused across evaluate() calls.
 */
import { Result } from '../common/evaluable.js';
import { ArrayInput, ExpressionInput, Input } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { CompactRef } from './refs.js';
export type Bytecode = (number | Result)[];
export interface CompiledExpression {
    bytecode: Bytecode;
    refs: CompactRef[];
    numLocals: number;
    consts: ArrayInput[];
    opNames: Record<number, string>;
    refKeys: string[];
    refRawKeys: string[];
    overlapRefsResiduals: Array<[number, Input[]]>;
    directionMap: Array<[number, 0 | 1]>;
    refFirstCtxKeys: (string | undefined)[];
}
/**
 * Compile a raw ExpressionInput into bytecode.
 * The result should be cached and reused across evaluate() calls.
 */
export declare function compile(raw: ExpressionInput, opts: Options): CompiledExpression;
