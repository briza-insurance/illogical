import { Evaluable } from '../common/evaluable'
import { isEvaluable, isNull, isUndefined } from '../common/type-check'
import { Input } from '../parser'

export const simplifyNotIn =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const [left, right] = operands

    const leftArray = Array.isArray(left)
    const rightArray = Array.isArray(right)

    if (
      isNull(left) ||
      isUndefined(left) ||
      isNull(right) ||
      isUndefined(right) ||
      (leftArray && rightArray) ||
      (!leftArray && !rightArray)
    ) {
      return true
    }

    if (leftArray) {
      // If any operand is still an Evaluable, we cannot simplify further
      const rightSimplified = simplifyInput(right)
      if (isEvaluable(rightSimplified)) {
        return input
      }
      const leftSimplified = left.map(simplifyInput)
      if (leftSimplified.some(isEvaluable)) {
        return input
      }
      return leftSimplified.indexOf(rightSimplified) === -1
    }

    if (rightArray) {
      const leftSimplified = simplifyInput(left)
      if (isEvaluable(leftSimplified)) {
        return input
      }
      const rightSimplified = right.map(simplifyInput)
      if (rightSimplified.some(isEvaluable)) {
        return input
      }
      return rightSimplified.indexOf(leftSimplified) === -1
    }

    return input
  }
