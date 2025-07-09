import { Evaluable } from '../common/evaluable'
import { isBoolean } from '../common/type-check'
import { Input } from '../parser'
import { isNonFalseResult, isTrueResult } from './type-check'

export const simplifyOr =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [operator, ...operands] = input

    const simplifiedOperands: (Input | Evaluable)[] = []
    for (const operand of operands) {
      const simplification = simplifyInput(operand)
      if (isBoolean(simplification) && isTrueResult(simplification)) {
        // Short-circuit for OR
        return true
      } else if (simplification) {
        simplifiedOperands.push(simplification)
      }
    }

    const simplified = simplifiedOperands.filter(isNonFalseResult)

    if (simplified.length === 0) {
      return false
    }
    if (simplified.length === 1) {
      return simplified[0]
    }
    return [operator, ...simplified]
  }
