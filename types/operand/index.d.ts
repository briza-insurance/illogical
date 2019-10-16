/**
 * Operand module.
 * @module illogical/operand
 */
import { Evaluable, Context, Result } from '../common/evaluable';
/**
 * Abstract operand
 */
export declare abstract class Operand implements Evaluable {
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
