import { isString } from '../../common/type-check/'
import { Evaluable } from '../../evaluable'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('prefix')

export const prefix = (left: Evaluable, right: Evaluable): Comparison =>
  comparison({
    operator: 'prefix',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) =>
      isString(left) && isString(right) ? right.startsWith(left) : false,
    toString: () => `(<${left.toString()}>${right.toString()})`,
  })
