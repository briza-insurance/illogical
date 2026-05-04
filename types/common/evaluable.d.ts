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
/**
 * Data type casting for references.
 */
export declare enum DataType {
    Number = "Number",
    String = "String"
}
export {};
