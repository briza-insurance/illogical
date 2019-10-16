import { Context, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Greater than or equal comparison expression
 */
export declare class GreaterThanOrEqual extends Comparison {
    /**
     * @constructor
     * @param {Operand} left Left operand.
     * @param {Operand} right Right operand.
     */
    constructor(left: Operand, right: Operand);
    /**
     * Evaluate in the given context
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
}
