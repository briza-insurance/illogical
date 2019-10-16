import { Result } from '../common/evaluable';
import { Operand } from '.';
/**
 * Static value operand
 */
export declare class Value implements Operand {
    private readonly value;
    /**
     * @constructor
     * @param {Result} value Constant value.
     */
    constructor(value: Result);
    /**
     * Evaluate in the given context
     * @param {Context} ctx
     * @return {boolean}
     */
    evaluate(): Result;
    /**
     * Get the strict representation of the operand
     * @return {string}
     */
    toString(): string;
}
