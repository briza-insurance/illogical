import { Evaluable } from '../common/evaluable'
import { isEvaluable, isString } from '../common/type-check'
import { Input } from '../parser'
import { Options } from '../parser/options'

const simplify =
  (
    opts: Options,
    simplifyInput: (input: Input) => Input | Evaluable,
    startsWith = true
  ) =>
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

    if (isString(leftSimplified) && isString(rightSimplified)) {
      return startsWith
        ? rightSimplified.startsWith(leftSimplified)
        : leftSimplified.endsWith(rightSimplified)
    }

    return false
  }

export const simplifyPrefix =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(opts, simplifyInput)(input)

export const simplifySuffix =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(opts, simplifyInput, false)(input)
