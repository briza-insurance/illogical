import { Evaluable } from '../common/evaluable'
import { isEvaluable } from '../common/type-check'
import { Input } from '../parser'

export const simplifyOverlap =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const [left, right] = operands

    const leftSimplified = simplifyInput(left)
    const rightSimplified = simplifyInput(right)

    const isLeftEvaluable = isEvaluable(leftSimplified)
    const isRightEvaluable = isEvaluable(rightSimplified)

    if (isLeftEvaluable || isRightEvaluable) {
      // If either left or right is an array, we cannot simplify further
      return input
    }

    // If simplified results are not arrays, it means we had a strictKey
    // without values provided. Simplify to false.
    if (!Array.isArray(leftSimplified) || !Array.isArray(rightSimplified)) {
      return false
    }

    const rightSet = new Set(rightSimplified)

    const res = leftSimplified.some((element) => rightSet.has(element))

    if (res) {
      return true
    }

    return false
  }
