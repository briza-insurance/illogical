/**
 * Operand module.
 * @module illogical/operand
 */
import { Result } from '../common/evaluable';
import { Input } from '../parser';
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
     * {@link Evaluable.evaluate}
     */
    evaluate(): Result;
    /**
     * {@link Evaluable.simplify}
     */
    simplify(): Result;
    /**
     * {@link Evaluable.serialize}
     */
    serialize(): Input;
    /**
     * Get the strict representation of the operand.
     * @return {string}
     */
    toString(): string;
}
