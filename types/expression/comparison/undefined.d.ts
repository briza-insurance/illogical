/**
 * Undefined expression module.
 * @module illogical/expression/comparison
 */
import { Evaluable, Result } from '../../common/evaluable';
import { ExpressionInput } from '../../parser';
import { Options } from '../../parser/options';
import { Comparison } from '../comparison';
export declare const OPERATOR: unique symbol;
/**
 * Undefined comparison expression
 */
export declare class Undefined extends Comparison {
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
    /**
     * {@link Evaluable.serialize}
     */
    serialize(options: Options): ExpressionInput;
}
