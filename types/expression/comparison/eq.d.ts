import { Evaluable, Result } from '../../common/evaluable';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Equal comparison expression
 */
export declare class Equal extends Comparison {
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
