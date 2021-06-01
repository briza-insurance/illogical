import { asExpected } from '../../common/utils'
import { Evaluable, EvaluatedPrimitive } from '../../evaluable'
import { isCollection } from '../../operand/collection'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('overlap')

export const overlap = (left: Evaluable, right: Evaluable): Comparison => {
  const leftIsArray = isCollection(left)
  const rightIsArray = isCollection(right)

  if (!leftIsArray || !rightIsArray) {
    throw new Error('invalid OVERLAP expression, both operands must be array')
  }

  return comparison({
    operator: 'overlap',
    kind: KIND,
    operands: [left, right],
    comparison: (left, right) =>
      asExpected<EvaluatedPrimitive[]>(left).some((value) =>
        asExpected<EvaluatedPrimitive[]>(right).includes(value)
      ),
  })
}
