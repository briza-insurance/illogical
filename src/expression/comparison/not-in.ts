import { asExpected } from '../../common/utils'
import { Evaluable, EvaluatedPrimitive } from '../../evaluable'
import { isCollection } from '../../operand/collection'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('not in')

export const notIn = (left: Evaluable, right: Evaluable): Comparison => {
  const leftIsArray = isCollection(left)
  const rightIsArray = isCollection(right)

  if (leftIsArray && rightIsArray) {
    throw new Error('invalid NOT IN expression, both operands are array')
  }
  if (!leftIsArray && !rightIsArray) {
    throw new Error('invalid NOT IN expression, non of the operands is array')
  }

  return comparison({
    operator: 'not in',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) =>
      asExpected<EvaluatedPrimitive[]>(leftIsArray ? left : right).indexOf(
        asExpected<EvaluatedPrimitive>(leftIsArray ? right : left)
      ) === -1,
    toString: () =>
      leftIsArray
        ? `(${right.toString()} not in ${left.toString()})`
        : `(${left.toString()} not in ${right.toString()})`,
  })
}
