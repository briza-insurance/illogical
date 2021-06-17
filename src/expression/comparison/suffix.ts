import { isString } from '../../common/type-check/'
import { Evaluable } from '../../evaluable'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('suffix')

export const suffix = (left: Evaluable, right: Evaluable): Comparison =>
  comparison({
    operator: 'suffix',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) =>
      isString(left) && isString(right) ? left.endsWith(right) : false,
    toString: () => `(${left.toString()}<${right.toString()}>)`,
  })
