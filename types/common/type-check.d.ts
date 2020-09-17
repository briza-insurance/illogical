/**
 * Common module.
 * @module illogical/common
 */
import { Evaluable, Result } from './evaluable';
/**
 * Is number predicate.
 * @param value Tested value.
 */
export declare function isNumber(value: Result): value is number;
/**
 * Is string type predicate.
 * @param value Tested value.
 */
export declare function isString(value: Result): value is string;
/**
 * Is Object
 * @param value tested value result of the test
 */
export declare function isObject(value: unknown): value is Record<string, unknown>;
/**
 * Is Boolean predicate.
 * @param value tested value.
 * @return result of the test
 */
export declare function isBoolean(value: unknown): value is boolean;
/**
 * Check if a value is a an Evaluable
 * @param {Result | Evaluable} value value to check if is Evaluable
 * @returns {Evaluable}
 */
export declare function isEvaluable(value: Result | Evaluable): value is Evaluable;
