/**
 * Operand module.
 * @module illogical/operand
 */
import { Context, Result } from '../common/evaluable';
import { Operand } from '.';
/**
 * Reference operand resolved within the context
 */
export declare class Reference extends Operand {
    private readonly key;
    /**
     * @constructor
     * @param {string} key Context key.
     */
    constructor(key: string);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {boolean}
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the operand.
     * @return {string}
     */
    toString(): string;
}
