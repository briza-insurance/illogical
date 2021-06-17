import { isNumber } from '../../common/type-check/'
import { Evaluable } from '../../evaluable'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('gt')

export const gt = (left: Evaluable, right: Evaluable): Comparison =>
  comparison({
    operator: '>',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) =>
      isNumber(left) && isNumber(right) ? left > right : false,
  })
