import { Evaluable, Result } from './evaluable'

/**
 * Is number predicate.
 * @param value Tested value.
 */
export function isNumber(value: Result): value is number {
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
export function isString(value: Result): value is string {
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

/**
 * Check if a value is a an Evaluable
 * @param {Result | Evaluable} value value to check if is Evaluable
 * @returns {Evaluable}
 */
export function isEvaluable(value: Result | Evaluable): value is Evaluable {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof value.evaluate === 'function' &&
    typeof value.simplify === 'function' &&
    typeof value.serialize === 'function' &&
    typeof value.toString === 'function'
  )
}

/**
 * Ensures all values are results.
 * @param {(Result | Evaluable)[]} values results or evaluables
 * @returns {boolean} type guard
 */
export function areAllResults(
  values: (Result | Evaluable)[]
): values is Result[] {
  return values.every((value) => !isEvaluable(value))
}

/**
 * Ensures all values are numbers.
 * @param {Result[]} results results or evaluables
 * @returns {boolean} type guard
 */
export function areAllNumbers(results: Result[]): results is number[] {
  return results.every(isNumber)
}
