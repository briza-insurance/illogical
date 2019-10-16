/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */
import { Context, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Equal comparison expression
 */
export declare class Equal extends Comparison {
    /**
     * @constructor
     * @param {Operand} left Left operand.
     * @param {Operand} right Right operand.
     */
    constructor(left: Operand, right: Operand);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
}
