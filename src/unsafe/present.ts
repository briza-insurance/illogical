import { Evaluable } from '../common/evaluable'
import { isEvaluable, isNull, isUndefined } from '../common/type-check'
import { Input } from '../parser'

const simplify =
  (
    simplifyInput: (input: Input) => Input | Evaluable,
    predicate: (input: Input) => boolean,
    present = true
  ) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const [operand] = operands
    const simplified = simplifyInput(operand)

    const isOperandEvaluable = isEvaluable(simplified)
    if (isOperandEvaluable) {
      return input
    }

    // Operand simplifies to itself when it is included in strictKeys or
    // optionalKeys, thus it was undefined.
    if (operand === simplified) {
      return !present
    }

    return predicate(simplified)
  }

export const simplifyPresent =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(
      simplifyInput,
      (input: Input) => !isUndefined(input) && !isNull(input)
    )(input)

export const simplifyUndefined =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(simplifyInput, isUndefined, false)(input)
