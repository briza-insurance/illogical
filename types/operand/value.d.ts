import { Result } from '../common/evaluable.js';
import { Input } from '../parser/index.js';
import { Operand } from './index.js';
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
