/**
 * Operand module.
 * @module illogical/operand
 */
import { Context, Evaluable, EvaluableType, Result } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
/**
 * Abstract operand
 */
export declare abstract class Operand implements Evaluable {
    type: EvaluableType;
    abstract evaluate(ctx: Context): Result;
    abstract simplify(ctx: Context): Result | Evaluable;
    abstract serialize(options: Options): Input;
    /**
     * Get the strict representation.
     */
    toString(): string;
}
