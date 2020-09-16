/**
 * Operand module.
 * @module illogical/operand
 */
import { Context, Evaluable, Result } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
import { Operand } from '.';
import { Reference } from './reference';
import { Value } from './value';
/**
 * Collection operand resolved containing mixture of value and references.
 */
export declare class Collection extends Operand {
    private readonly items;
    /**
     * @constructor
     * @param {Operand[]} items Collection of operands.
     */
    constructor(items: Array<Value | Reference>);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {boolean}
     */
    evaluate(ctx: Context): Result;
    simplify(...args: [Context]): Result | Evaluable;
    serialize(options: Options): Input;
    /**
     * Get the strict representation of the operand.
     * @return {string}
     */
    toString(): string;
}
