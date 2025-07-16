import { Context, Evaluable, EvaluableType, Result } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
/**
 * Abstract operand
 */
export declare abstract class Operand implements Evaluable {
    type: EvaluableType;
    /**
     * {@link Evaluable.evaluate}
     */
    abstract evaluate(ctx: Context): Result;
    /**
     * {@link Evaluable.simplify}
     */
    abstract simplify(ctx: Context, strictKeys?: Set<string>, optionalKeys?: Set<string>): Result | Evaluable;
    /**
     * {@link Evaluable.serialize}
     */
    abstract serialize(options: Options): Input;
    /**
     * Get the strict representation.
     */
    toString(): string;
}
