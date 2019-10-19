/**
 * Logical expression module.
 * @module illogical/expression/logical
 */
import { Context, Result, Evaluable } from '../../common/evaluable';
import { Comparison } from '../comparison';
/**
 * Operand collection
 */
export declare type Operand = Comparison | Logical;
/**
 * Abstract logical expression
 */
export declare abstract class Logical implements Evaluable {
    protected operator: string;
    protected operands: Operand[];
    /**
     * @constructor
     * @param {string} operator String representation of the operator.
     * @param {Operand[]} operands Collection of operands.
     */
    constructor(operator: string, operands: Operand[]);
    /**
     * Add new operand
     * @param {Operand} addon
     */
    add(addon: Operand): void;
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
}
