/**
 * Common module.
 * @module illogical/common
 */

import { Result } from './evaluable'

/**
 * Is number predicate.
 * @param {Result} value Tested value.
 * @return {boolean}
 */
export function isNumber (value: Result): boolean {
  return typeof value === 'number' && isFinite(value)
}

/**
 * Is string type predicate.
 * @param {Result} value
 * @return {boolean}
 */
export function isString (value: Result): boolean {
  return typeof value === 'string' || value instanceof String
}

/**
 * Is Object
 * @param {mixed} value tested value
 * @return {boolean} result of the test
 */
export function isObject (value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && value &&
      typeof value === 'object' && value.constructor === Object
}
