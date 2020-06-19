/**
 * Common module.
 * @module illogical/common
 */
/**
 * Evaluation Context
 * Holds references used during the evaluation process.
 * Format: key: value.
 */
export interface Context {
    [k: string]: object | string | number | boolean | null | string[] | number[] | undefined;
}
/**
 * Evaluation result
 */
export declare type Result = undefined | null | string | number | boolean | Array<string | number | boolean>;
/**
 * Evaluable
 */
export interface Evaluable {
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     * @return {Result}
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the evaluable expression.
     */
    toString(): string;
}
