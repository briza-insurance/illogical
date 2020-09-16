/**
 * Operand module.
 * @module illogical/operand
 */
import { Result } from '../common/evaluable';
import { Operand } from '.';
/**
 * Static value operand
 */
export declare class Value extends Operand {
    private readonly value;
    /**
     * @constructor
     * @param {Result} value Constant value.
     */
    constructor(value: Result);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {boolean}
     */
    evaluate(): Result;
    simplify(): Result;
    /**
     * Get the strict representation of the operand.
     * @return {string}
     */
    toString(): string;
}
