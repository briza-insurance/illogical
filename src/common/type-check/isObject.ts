import { isNullOrUndefined } from './isNullOrUndefined'

export const isObject = (value: unknown): value is Record<string, unknown> => {
  if (isNullOrUndefined(value)) {
    return false
  }
  if (typeof value !== 'object' || (value && value.constructor !== Object)) {
    return false
  }
  return true
}
