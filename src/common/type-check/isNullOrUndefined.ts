import { isNull } from './isNull'
import { isUndefined } from './isUndefined'

export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  isUndefined(value) || isNull(value)
