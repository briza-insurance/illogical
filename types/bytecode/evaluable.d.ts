import { Context, Result } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { CompiledExpression } from './compiler.js';
/**
 * Bytecode wrapper that provides a consistent interface for bytecode execution.
 */
export declare class BytecodeEvaluable {
    private readonly compiled;
    constructor(compiled: CompiledExpression);
    evaluate(ctx: Context): Result;
    simplify(ctx: Context, strictKeys?: string[] | Set<string>, optionalKeys?: string[] | Set<string>): Result | ExpressionInput;
}
