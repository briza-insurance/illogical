import { isString } from '../common/type-check/'
import { Evaluable, EvaluatedPrimitive } from '../evaluable'

export const KIND = Symbol('value')

export const value = (value: EvaluatedPrimitive): Evaluable => ({
  kind: KIND,
  evaluate: () => value,
  simplify: () => value,
  serialize: () => value,
  toString: () => (isString(value) ? `"${value}"` : `${value}`),
})
