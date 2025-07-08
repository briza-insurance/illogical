import { Evaluable } from '../common/evaluable'
import { isEvaluable } from '../common/type-check'
import { Input } from '../parser'
import { Options } from '../parser/options'

const simplifyEquality =
  (predicate: (left: Input, right: Input) => boolean) =>
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

    // See Equal.comparison
    return predicate(leftSimplified, rightSimplified)
  }

export const simplifyEq =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplifyEquality((left, right) => left === right)(opts, simplifyInput)(
      input
    )
export const simplifyNe =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplifyEquality((left, right) => left !== right)(opts, simplifyInput)(
      input
    )
