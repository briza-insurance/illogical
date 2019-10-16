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
