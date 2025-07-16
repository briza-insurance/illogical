import { Evaluable } from '../common/evaluable'
import { isBoolean, isEvaluable } from '../common/type-check'
import { OPERATOR as OPERATOR_NOR } from '../expression/logical/nor'
import { OPERATOR as OPERATOR_NOT } from '../expression/logical/not'
import { Input } from '../parser'
import { Options } from '../parser/options'
import { isFalseResult, isTrueResult } from './type-check'

export const simplifyXor =
  (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [operator, ...operands] = input

    let trueCount = 0
    const simplifiedOperands: Input[] = []
    for (const operand of operands) {
      const simplification = simplifyInput(operand)
      if (isBoolean(simplification) && isTrueResult(simplification)) {
        trueCount++
        continue
      }
      if (isBoolean(simplification) && isFalseResult(simplification)) {
        continue
      }
      if (!isEvaluable(simplification)) {
        simplifiedOperands.push(simplification)
      }
    }

    if (trueCount > 1) {
      return false
    }

    if (simplifiedOperands.length === 0) {
      return trueCount === 1
    }

    if (simplifiedOperands.length === 1) {
      if (trueCount === 1) {
        return [
          opts.operatorMapping.get(OPERATOR_NOT) ?? 'NOT',
          simplifiedOperands[0],
        ]
      }
      return simplifiedOperands[0]
    }
    if (trueCount === 1) {
      return [
        opts.operatorMapping.get(OPERATOR_NOR) ?? 'NOR',
        ...simplifiedOperands,
      ]
    }
    return [operator, ...simplifiedOperands]
  }
