/**
 * Suffix expression module.
 * @module illogical/expression/suffix
 */
import { Context, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Suffix comparison expression
 */
export declare class Suffix extends Comparison {
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
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
}
