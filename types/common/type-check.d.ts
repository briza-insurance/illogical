import { Result } from './evaluable.js';
/**
 * Is number predicate.
 * @param value Tested value.
 */
export declare function isNumber(value: unknown): value is number;
/**
 * Is number predicate.
 * @param value Tested value.
 */
export declare function isInfinite(value: Result): value is typeof Infinity;
/**
 * Is string type predicate.
 * @param value Tested value.
 */
export declare function isString(value: unknown): value is string;
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
export declare function isUndefined(value: unknown): value is undefined;
export declare function isNull(value: unknown): value is null;
