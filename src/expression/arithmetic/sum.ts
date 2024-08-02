import { Evaluable, Result } from '../../common/evaluable'
import { areAllNumbers } from '../../common/type-check'
import { Operand } from '../../operand'
import { Arithmetic } from '.'
import { operateWithExpectedDecimals } from './operateWithExpectedDecimals'

// Operator key
export const OPERATOR = Symbol('SUM')

const addWithExpectedDecimals = operateWithExpectedDecimals()

/**
 * Sum operation expression
 */
export class Sum extends Arithmetic {
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
      throw new Error('sum expression requires at least 2 operands')
    }
    super('+', OPERATOR, operands)
  }

  operate(results: Result[]): Result {
    if (!areAllNumbers(results)) {
      throw new Error('operands must be numbers for sum')
    }
    return results.reduce((acc, result) => addWithExpectedDecimals(acc, result))
  }
}
