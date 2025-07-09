import { Evaluable } from '../common/evaluable'
import { isEvaluable, isNumber } from '../common/type-check'
import { toDateNumber } from '../common/util'
import { Input } from '../parser'
import { Options } from '../parser/options'

const simplifyComparison =
  (predicate: (left: number, right: number) => boolean) =>
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [operator, ...operands] = input

    const [left, right] = operands
    const leftSimplified = simplifyInput(left)
    const rightSimplified = simplifyInput(right)

    const isLeftEvaluable = isEvaluable(leftSimplified)
    const isRightEvaluable = isEvaluable(rightSimplified)

    if (isLeftEvaluable || isRightEvaluable) {
      // If either left or right is an array, we cannot simplify further
      return [
        operator,
        isLeftEvaluable ? leftSimplified.serialize(opts) : left,
        isRightEvaluable ? rightSimplified.serialize(opts) : right,
      ]
    }

    if (isNumber(leftSimplified) && isNumber(rightSimplified)) {
      return predicate(leftSimplified, rightSimplified)
    }

    const leftDate = toDateNumber(leftSimplified)
    const rightDate = toDateNumber(rightSimplified)
    if (leftDate && rightDate) {
      return predicate(leftDate, rightDate)
    }

    if (Array.isArray(leftSimplified) || Array.isArray(rightSimplified)) {
      return [operator, leftSimplified, rightSimplified]
    }

    return false
  }

export const simplifyGt =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplifyComparison((left, right) => left > right)(opts, simplifyInput)(
      input
    )

export const simplifyGe =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplifyComparison((left, right) => left >= right)(opts, simplifyInput)(
      input
    )

export const simplifyLt =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplifyComparison((left, right) => left < right)(opts, simplifyInput)(
      input
    )

export const simplifyLe =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplifyComparison((left, right) => left <= right)(opts, simplifyInput)(
      input
    )
