import { Evaluable } from '../common/evaluable'
import { isBoolean, isUndefined } from '../common/type-check'
import { OPERATOR as OPERATOR_NOT } from '../expression/logical/not'
import { Input } from '../parser'
import { Options } from '../parser/options'
import { isNonFalseResult, isTrueResult } from './type-check'

export const simplifyNor =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [operator, ...operands] = input

    const simplifiedOperands: (Input | Evaluable)[] = []
    for (const operand of operands) {
      const simplification = simplifyInput(operand)
      if (
        isUndefined(simplification) ||
        (isBoolean(simplification) && isTrueResult(simplification))
      ) {
        // Short-circuit for AND
        return false
      }
      simplifiedOperands.push(simplification)
    }

    // Remove true operands leaving only the Inputs
    const simplified = simplifiedOperands.filter(isNonFalseResult)

    if (simplified.length === 0) {
      return true
    }
    if (simplified.length === 1) {
      return [opts.operatorMapping.get(OPERATOR_NOT) ?? 'NOT', simplified[0]]
    }
    return [operator, ...simplified]
  }
