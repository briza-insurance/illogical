import { Evaluable } from '../common/evaluable'
import { isEvaluable } from '../common/type-check'
import { Input } from '../parser'
import { extractValues } from './type-check'

export const simplifyOverlap =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const [left, right] = operands

    const leftSimplified = simplifyInput(left)
    const rightSimplified = simplifyInput(right)

    const isLeftEvaluable = isEvaluable(leftSimplified)
    const isRightEvaluable = isEvaluable(rightSimplified)

    // If we don't have all operands simplified, we can try the positive case
    // of the values we have satisfying the OVERLAP. But if not, we need to
    // return the original input.
    if (isLeftEvaluable || isRightEvaluable) {
      const leftValues = extractValues(leftSimplified)
      const rightValues = extractValues(rightSimplified)

      const rightSet = new Set(rightValues)
      const res = leftValues.some((element) => rightSet.has(element))

      if (res) {
        return true
      }

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
