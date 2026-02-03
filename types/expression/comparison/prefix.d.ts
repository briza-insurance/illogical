import { Evaluable, Result } from '../../common/evaluable.js';
import { Comparison } from '../comparison/index.js';
export declare const OPERATOR: unique symbol;
/**
 * Prefix comparison expression
 */
export declare class Prefix extends Comparison {
    /**
     * @constructor
     * @param {Evaluable} left Left operand.
     * @param {Evaluable} right Right operand.
     */
    constructor(...args: Evaluable[]);
    /**
     * {@link Comparison.comparison}
     */
    comparison(left: Result, right: Result): boolean;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
}
