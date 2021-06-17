import { Evaluable } from '../../evaluable'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('ne')

export const ne = (left: Evaluable, right: Evaluable): Comparison =>
  comparison({
    operator: '!=',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) => left !== right,
  })
