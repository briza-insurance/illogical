import { Evaluable } from '../common/evaluable'
import { isEvaluable, isNull, isUndefined } from '../common/type-check'
import { Input } from '../parser'

export const simplifyIn =
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
      isUndefined(right)
    ) {
      return false
    }
    const leftSimplified = simplifyInput(left)
    const rightSimplified = simplifyInput(right)

    // If left is an array, right side could be a reference containing a
    // single value or a value directly.
    if (leftArray) {
      const rightSimplified = simplifyInput(right)
      // If any operand is still an Evaluable, we cannot simplify further
      if (isEvaluable(rightSimplified)) {
        return input
      }
      const leftSimplified = left.map(simplifyInput)
      if (leftSimplified.some(isEvaluable)) {
        return input
      }
      return leftSimplified.indexOf(rightSimplified) > -1
    }

    // If right is an array, left side could be a reference containing a
    // single value or a value directly.
    if (rightArray) {
      const leftSimplified = simplifyInput(left)
      // If any operand is still an Evaluable, we cannot simplify further
      if (isEvaluable(leftSimplified)) {
        return input
      }
      const rightSimplified = right.map(simplifyInput)
      if (rightSimplified.some(isEvaluable)) {
        return input
      }
      return rightSimplified.indexOf(leftSimplified) > -1
    }

    // If none of them are arrays it means one of them must be a reference
    // containing a list of values.
    if (Array.isArray(leftSimplified)) {
      if (isEvaluable(rightSimplified)) {
        return input
      }
      return leftSimplified.indexOf(rightSimplified) > -1
    }
    if (Array.isArray(rightSimplified)) {
      if (isEvaluable(leftSimplified)) {
        return input
      }
      return rightSimplified.indexOf(leftSimplified) > -1
    }

    return input
  }
