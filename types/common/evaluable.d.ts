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
    [k: string]: string | number | boolean | null | string[] | number[];
}
/**
 * Evaluation result
 */
export declare type Result = undefined | null | string | number | boolean | number[] | string[];
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
