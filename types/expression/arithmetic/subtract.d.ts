import { Evaluable, Result } from '../../common/evaluable.js';
import { Arithmetic } from './index.js';
export declare const OPERATOR: unique symbol;
/**
 * Subtract operation expression
 */
export declare class Subtract extends Arithmetic {
    /**
     * @constructor Generic constructor
     * @param {Evaluable[]} args
     */
    constructor(...args: Evaluable[]);
    operate(results: Result[]): Result;
}
