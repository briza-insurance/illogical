/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */
import { Evaluable, Result } from '../../common/evaluable';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Not in comparison expression
 */
export declare class NotIn extends Comparison {
    /**
     * @constructor
     * @param {Evaluable} left Left operand.
     * @param {Evaluable} right Right operand.
     */
    constructor(...args: Evaluable[]);
    comparison(left: Result, right: Result): boolean;
    /**
     * Get the strict representation of the expression
     * @return {string}
     */
    toString(): string;
}
