import { Evaluable, Result } from '../../common/evaluable.js';
import { ExpressionInput } from '../../parser/index.js';
import { Options } from '../../parser/options.js';
import { Comparison } from './index.js';
export declare const OPERATOR: unique symbol;
/**
 * Present comparison expression
 */
export declare class Present extends Comparison {
    /**
     * @constructor
     * @param {Evaluable} operand
     */
    constructor(...args: Evaluable[]);
    /**
     * {@link Comparison.comparison}
     */
    comparison(left: Result): boolean;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
    serialize(options: Options): ExpressionInput;
}
