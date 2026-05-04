import { Result } from './evaluable.js'

/**
 * Is number predicate.
 * @param value Tested value.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}
/**
 * Is number predicate.
 * @param value Tested value.
 */
export function isInfinite(value: Result): value is typeof Infinity {
  return typeof value === 'number' && !isFinite(value)
}

/**
 * Is string type predicate.
 * @param value Tested value.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

/**
 * Is Object
 * @param value tested value result of the test
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value !== 'object' || value?.constructor !== Object) {
    return false
  }
  return true
}

/**
 * Is Boolean predicate.
 * @param value tested value.
 * @return result of the test
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isNull(value: unknown): value is null {
  return value === null
}
