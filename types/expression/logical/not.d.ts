import { Context, Evaluable, Result, SimplifyArgs } from '../../common/evaluable';
import { Logical } from '.';
export declare const OPERATOR: unique symbol;
/**
 * Not logical expression
 */
export declare class Not extends Logical {
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
     * {@link Evaluable.simplify}
     */
    simplify(...args: SimplifyArgs): boolean | Evaluable;
}
