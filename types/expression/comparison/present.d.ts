/**
 * Present expression module.
 * @module illogical/expression/comparison
 */
import { Context, Evaluable, Result } from '../../common/evaluable';
import { Comparison } from './index';
export declare const OPERATOR: unique symbol;
/**
 * Present comparison expression
 */
export declare class Present extends Comparison {
    /**
     * @constructor
     * @param {Evaluable} operand
     */
    constructor(...args: Evaluable[]);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
}
