import { Context, Evaluable, EvaluableType, Result } from '../common/evaluable.js';
import { Input } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { CompiledExpression } from './compiler.js';
export declare class BytecodeEvaluable implements Evaluable {
    private readonly compiled;
    private readonly delegate;
    readonly type = EvaluableType.Expression;
    constructor(compiled: CompiledExpression, delegate: Evaluable);
    evaluate(ctx: Context): Result;
    simplify(_ctx: Context, _strictKeys?: string[] | Set<string>, _optionalKeys?: string[] | Set<string>): never;
    serialize(options: Options): Input;
    toString(): string;
}
