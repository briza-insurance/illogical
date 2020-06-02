/**
 * Undefined expression module.
 * @module illogical/expression/comparison
 */
import { Context, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
import { Predicate } from '.';
export declare const OPERATOR: unique symbol;
/**
 * Undefined predicate expression
 */
export declare class Undefined extends Predicate {
    /**
     * @constructor
     * @param {Operand} operand
     */
    constructor(operand: Operand);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
}
