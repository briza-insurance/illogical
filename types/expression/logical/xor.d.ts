/**
 * Logical expression module.
 * @module illogical/expression/logical
 */
import { Context, Evaluable, Result } from '../../common/evaluable';
import { Logical } from '../logical';
export declare const OPERATOR: unique symbol;
/**
 * Xor logical expression
 */
export declare class Xor extends Logical {
    /**
     * @constructor
     * @param {Evaluable[]} operands Collection of operands.
     */
    constructor(operands: Evaluable[]);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
}
