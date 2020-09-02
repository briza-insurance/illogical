/* eslint-disable no-undef */
/**
 * Common module.
 * @module illogical/common
 */

import { Result } from './evaluable'

/**
 * Is number predicate.
 * @param value Tested value.
 */
export function isNumber (value: Result): value is number {
  return typeof value === 'number' && isFinite(value)
}

/**
 * Is string type predicate.
 * @param value Tested value.
 */
export function isString (value: Result): value is string {
  return typeof value === 'string' || value instanceof String
}

/**
 * Is Object
 * @param value tested value result of the test
 */
export function isObject (value: unknown): value is Record<string, unknown> {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value !== 'object' || value?.constructor !== Object) {
    return false
  }
  return true
}
