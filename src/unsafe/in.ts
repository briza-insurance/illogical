import { Evaluable } from '../common/evaluable'
import { isEvaluable, isNull, isUndefined } from '../common/type-check'
import { Input } from '../parser'
import { extractValues } from './type-check'

const simplify = (
  originalInput: Input,
  nonArrayInput: Input | Evaluable,
  arrayInput: Input[] | [string, ...Input[]] | Evaluable
) => {
  // If we don't have the non-array operand, there is nothing to do.
  if (isEvaluable(nonArrayInput)) {
    return originalInput
  }

  // If we don't have all the values, try with what we have for the
  // positive case, but otherwise return the original input.
  if (isEvaluable(arrayInput)) {
    const leftValues = extractValues(arrayInput)
    const isFound = leftValues.indexOf(nonArrayInput) > -1

    return isFound ? true : originalInput
  }

  // If we have all the values, we can check if the non-array operand is
  // included in the array operand.
  return arrayInput.indexOf(nonArrayInput) > -1
}

export const simplifyIn =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const [left, right] = operands

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

    const isLeftArray =
      Array.isArray(leftSimplified) || isEvaluable(leftSimplified)
    const isRightArray =
      Array.isArray(rightSimplified) || isEvaluable(rightSimplified)

    if (isLeftArray) {
      return simplify(input, rightSimplified, leftSimplified)
    }

    if (isRightArray) {
      return simplify(input, leftSimplified, rightSimplified)
    }

    return false
  }
