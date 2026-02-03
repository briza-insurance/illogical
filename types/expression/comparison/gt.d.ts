import { Evaluable, Result } from '../../common/evaluable.js';
import { Comparison } from '../comparison/index.js';
export declare const OPERATOR: unique symbol;
/**
 * Greater than comparison expression
 */
export declare class GreaterThan extends Comparison {
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
}
