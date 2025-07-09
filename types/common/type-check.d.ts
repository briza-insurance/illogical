import { Evaluable, Result } from './evaluable';
/**
 * Is number predicate.
 * @param value Tested value.
 */
export declare function isNumber(value: Result): value is number;
/**
 * Is number predicate.
 * @param value Tested value.
 */
export declare function isInfinite(value: Result): value is typeof Infinity;
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
/**
 * Ensures all values are results.
 * @param {(Result | Evaluable)[]} values results or evaluables
 * @returns {boolean} type guard
 */
export declare function areAllResults(values: (Result | Evaluable)[]): values is Result[];
/**
 * Ensures all values are numbers.
 * @param {Result[]} results results or evaluables
 * @returns {boolean} type guard
 */
export declare function areAllNumbers(results: Result[]): results is number[];
export declare function isUndefined(value: unknown): value is undefined;
export declare function isNull(value: unknown): value is null;
