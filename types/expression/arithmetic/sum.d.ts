import { Evaluable, Result } from '../../common/evaluable';
import { Arithmetic } from '.';
export declare const OPERATOR: unique symbol;
/**
 * Sum operation expression
 */
export declare class Sum extends Arithmetic {
    /**
     * @constructor Generic constructor
     * @param {Evaluable[]} args
     */
    constructor(...args: Evaluable[]);
    operate(results: Result[]): Result;
}
