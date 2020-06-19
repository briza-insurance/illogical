/**
 * Logical expression module.
 * @module illogical/expression/logical
 */
import { Nor } from './nor';
import { Evaluable } from '../../common/evaluable';
export declare const OPERATOR: unique symbol;
/**
 * Not logical expression
 */
export declare class Not extends Nor {
    /**
     * @constructor
     * @param {Evaluable} operand
     */
    constructor(...args: Evaluable[]);
}
