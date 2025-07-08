import { Evaluable } from '../common/evaluable'
import { isBoolean, isUndefined } from '../common/type-check'
import { Input } from '../parser'
import { isNonTrueResult, isTrueResult } from './type-check'

export const simplifyAnd =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [operator, ...operands] = input

    const simplifiedOperands: (Input | Evaluable)[] = []
    for (const operand of operands) {
      const simplification = simplifyInput(operand)
      if (
        isUndefined(simplification) ||
        (isBoolean(simplification) && !isTrueResult(simplification))
      ) {
        // Short-circuit for AND
        return false
      }
      simplifiedOperands.push(simplification)
    }

    // Remove false operands leaving only the Inputs
    const simplified = simplifiedOperands.filter(isNonTrueResult)

    if (simplified.length === 0) {
      return true
    }
    if (simplified.length === 1) {
      return simplified[0]
    }
    return [operator, ...simplified]
  }
