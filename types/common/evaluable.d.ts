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
export declare type Result = undefined | null | string | number | boolean | Array<string | number | boolean | null>;
export declare enum EvaluableType {
    Operand = "Operand",
    Expression = "Expression"
}
/**
 * Evaluable
 */
export interface Evaluable {
    type: EvaluableType;
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
