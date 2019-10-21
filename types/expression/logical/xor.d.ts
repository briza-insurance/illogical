/**
 * Logical expression module.
 * @module illogical/expression/logical
 */
import { Context, Result } from '../../common/evaluable';
import { Logical, Operand } from '../logical';
export declare const OPERATOR: unique symbol;
/**
 * Xor logical expression
 */
export declare class Xor extends Logical {
    /**
     * @constructor
     * @param {Operand[]} operands Collection of operands.
     */
    constructor(operands: Operand[]);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
}
