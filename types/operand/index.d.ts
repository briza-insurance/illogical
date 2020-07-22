/**
 * Operand module.
 * @module illogical/operand
 */
import { Evaluable, Context, Result, EvaluableType } from '../common/evaluable';
/**
 * Abstract operand
 */
export declare abstract class Operand implements Evaluable {
    type: EvaluableType;
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation.
     */
    toString(): string;
}
