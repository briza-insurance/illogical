import { Evaluable } from '../common/evaluable'
import { isBoolean } from '../common/type-check'
import { Input } from '../parser'

export const simplifyNot =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const simplification = simplifyInput(operands[0])

    if (isBoolean(simplification)) {
      return !simplification
    }

    return input
  }
