/**
 * Common module.
 * @module illogical/common
 */
import { Result } from './evaluable';
/**
 * Is number predicate.
 * @param {Result} value Tested value.
 * @return {boolean}
 */
export declare function isNumber(value: Result): boolean;
/**
 * Is string type predicate.
 * @param {Result} value
 * @return {boolean}
 */
export declare function isString(value: Result): boolean;
/**
 * Is Object
 * @param {mixed} value tested value
 * @return {boolean} result of the test
 */
export declare function isObject(value: unknown): value is Record<string, unknown>;
