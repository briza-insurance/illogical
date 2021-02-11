import { Result } from './evaluable'
import { isNumber, isString } from './type-check'

/**
 * Convert a value to number if possible, otherwise return the value untouched
 * @param value value to be converted to number
 */
export const toNumber = (value: Result): Result => {
  const isValueNumber = isNumber(value)
  if (isValueNumber) {
    return value as number
  } else if (isString(value)) {
    if (value.match(/^\d+\.\d+$/)) {
      return parseFloat(value)
    } else if (value.match(/^0$|^[1-9]\d*$/)) {
      return parseInt(value)
    }
  }
  return value
}
