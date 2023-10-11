import { Result } from './evaluable';
/**
 * Convert a value to number if possible, otherwise return undefined
 * @param value value to be converted to number
 */
export declare const toNumber: (value: Result) => number | undefined;
/**
 * Convert a value to string if possible, otherwise return undefined
 * @param value value to be converted to string
 */
export declare const toString: (value: Result) => string | undefined;
/**
 * Convert a value to number if it's type is string, otherwise return NaN
 * @param value value to be converted to number
 */
export declare const toDateNumber: (value: Result) => number;
