/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */
import { Evaluable, Result } from '../../common/evaluable';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Less than comparison expression
 */
export declare class LessThan extends Comparison {
    /**
     * @constructor
     * @param {Evaluable} left Left operand.
     * @param {Evaluable} right Right operand.
     */
    constructor(...args: Evaluable[]);
    comparison(left: Result, right: Result): boolean;
}
