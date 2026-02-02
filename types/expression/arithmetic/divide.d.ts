import { Evaluable, Result } from '../../common/evaluable.js';
import { Arithmetic } from './index.js';
export declare const OPERATOR: unique symbol;
/**
 * Divide operation expression
 */
export declare class Divide extends Arithmetic {
    /**
     * @constructor Generic constructor
     * @param {Evaluable[]} args
     */
    constructor(...args: Evaluable[]);
    operate(results: Result[]): Result;
}
