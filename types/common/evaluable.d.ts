import { Input } from '../parser';
import { Options } from '../parser/options';
/**
 * Valid types for context members
 */
type ContextValue = Record<string, unknown> | string | number | boolean | null | undefined | ContextValue[];
/**
 * Evaluation Context
 * Holds references used during the evaluation process.
 * Format: key: value.
 */
export interface Context {
    [k: string]: ContextValue;
}
/**
 * Evaluation result
 */
export type Result = undefined | null | string | number | boolean | Array<Result> | Record<string, unknown>;
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
     * Simplifies this Evaluable when possible.
     *
     * @param {Context} ctx context for the evaluation
     * @param {string[]} strictKeys keys to be considered present even if they are not present in the context
     * @param {string[]} optionalKeys keys to be considered not present unless they are in the context or in
     *  `strictKeys`; when `strictKeys` is `undefined` and `optionalKeys` is an array, every key that is not in
     *  `optionalKeys` is considered to be present and thus will be evaluated
     * @returns {Result | Evaluable} simplified value or itself
     */
    simplify(ctx: Context, strictKeys?: string[], optionalKeys?: string[]): Result | Evaluable;
    /**
     * Serializes the Evaluable to its input format.
     *
     * @param {Options} options parser options
     */
    serialize(options: Options): Input;
    /**
     * Get the strict representation of the evaluable expression.
     */
    toString(): string;
}
export type SimplifyArgs = Parameters<Evaluable['simplify']>;
export {};
