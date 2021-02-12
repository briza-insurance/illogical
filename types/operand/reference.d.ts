/**
 * Operand module.
 * @module illogical/operand
 */
import { Context, Evaluable, Result } from '../common/evaluable';
import { Options } from '../parser/options';
import { Operand } from '.';
/**
 * Reference operand resolved within the context
 */
export declare class Reference extends Operand {
    private readonly key;
    private readonly dataType;
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
     * {@link Evaluable.simplify}
     */
    simplify(ctx: Context, ignoreKeys: string[]): Result | Evaluable;
    /**
     * {@link Evaluable.serialize}
     */
    serialize({ referenceSerialization }: Options): string;
    /**
     * Get the strict representation of the operand.
     * @return {string}
     */
    toString(): string;
}
