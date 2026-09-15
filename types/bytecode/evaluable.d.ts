import { Context, Evaluable, EvaluableType, Result } from '../common/evaluable.js';
import { Input } from '../parser/index.js';
import { CompiledExpression } from './compiler.js';
export declare class BytecodeEvaluable implements Evaluable {
    private readonly compiled;
    readonly type = EvaluableType.Expression;
    constructor(compiled: CompiledExpression);
    evaluate(ctx: Context): Result;
    simplify(ctx: Context, strictKeys?: string[] | Set<string>, optionalKeys?: string[] | Set<string>): Result | Input;
    serialize(): Input;
    toString(): string;
}
