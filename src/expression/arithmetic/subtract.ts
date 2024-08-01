import { Evaluable, Result } from '../../common/evaluable'
import { areAllNumbers } from '../../common/type-check'
import { Operand } from '../../operand'
import { Arithmetic } from '.'

// Operator key
export const OPERATOR = Symbol('SUBTRACT')

const getNumDecimals = (num: number) => {
  const numberSplit = num.toString().split('.')
  return numberSplit.length == 2 ? numberSplit[1].length : 0
}

const subtractWithExpectedDecimals = (first: number, second: number) => {
  const numDecimals1 = getNumDecimals(first)
  const numDecimals2 = getNumDecimals(second)

  const maxDecimals = numDecimals1 > numDecimals2 ? numDecimals1 : numDecimals2

  return Number((first - second).toFixed(maxDecimals))
}

/**
 * Subtract operation expression
 */
export class Subtract extends Arithmetic {
  /**
   * @constructor Generic constructor
   * @param {Evaluable[]} args
   */
  constructor(...args: Evaluable[])
  /**
   * @constructor
   * @param {Operand[]} operands Operands.
   */
  constructor(...operands: Operand[]) {
    if (operands.length < 2) {
      throw new Error('subtract expression requires at least 2 operands')
    }
    super('-', OPERATOR, operands)
  }

  operate(results: Result[]): Result {
    if (!areAllNumbers(results)) {
      throw new Error('operands must be numbers for subtract')
    }
    return results.reduce((acc, result) =>
      subtractWithExpectedDecimals(acc, result)
    )
  }
}
