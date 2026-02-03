import { Context, Evaluable, Result, SimplifyArgs } from '../../common/evaluable.js';
import { Logical } from '../logical/index.js';
export declare const OPERATOR: unique symbol;
/**
 * And logical expression
 */
export declare class And extends Logical {
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
    /**
     * {@link Evaluable.simplify}
     */
    simplify(...args: SimplifyArgs): boolean | Evaluable;
}
