/**
 * Logical expression module.
 * @module illogical/expression/logical
 */
import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable';
/**
 * Abstract logical expression
 */
export declare abstract class Logical implements Evaluable {
    type: EvaluableType;
    protected operator: string;
    protected operands: Evaluable[];
    /**
     * @constructor
     * @param {string} operator String representation of the operator.
     * @param {Evaluable[]} operands Collection of operands.
     */
    constructor(operator: string, operands: Evaluable[]);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
}
