/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */
import { Context, Evaluable, Result } from '../../common/evaluable';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Greater than comparison expression
 */
export declare class GreaterThan extends Comparison {
    /**
     * @constructor
     * @param {Evaluable} left Left operand.
     * @param {Evaluable} right Right operand.
     */
    constructor(...args: Evaluable[]);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
}
