/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */
import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
/**
 * Abstract comparison expression
 */
export declare abstract class Comparison implements Evaluable {
    type: EvaluableType;
    protected operator: string;
    protected left: Operand;
    protected right: Operand;
    /**
     * @constructor
     * @param {string} operator String representation of the operator.
     * @param {Operand} left Left operand.
     * @param {Operand} right Right operand.
     */
    constructor(operator: string, left: Operand, right: Operand);
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
