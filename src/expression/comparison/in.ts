import { asExpected } from '../../common/utils'
import { Evaluable, EvaluatedPrimitive } from '../../evaluable'
import { isCollection } from '../../operand/collection'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('in')

export const In = (left: Evaluable, right: Evaluable): Comparison => {
  const leftIsArray = isCollection(left)
  const rightIsArray = isCollection(right)

  if (leftIsArray && rightIsArray) {
    throw new Error('invalid IN expression, both operands are an array')
  }
  if (!leftIsArray && !rightIsArray) {
    throw new Error('invalid IN expression, non of the operands are an array')
  }

  return comparison({
    operator: 'in',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) =>
      asExpected<EvaluatedPrimitive[]>(leftIsArray ? left : right).indexOf(
        asExpected<EvaluatedPrimitive>(leftIsArray ? right : left)
      ) > -1,
    toString: () =>
      leftIsArray
        ? `(${right.toString()} in ${left.toString()})`
        : `(${left.toString()} in ${right.toString()})`,
  })
}
