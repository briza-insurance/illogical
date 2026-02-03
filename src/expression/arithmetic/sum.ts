import { Evaluable, Result } from '../../common/evaluable.js'
import { Operand } from '../../operand/index.js'
import { Arithmetic } from './index.js'
import { operateWithExpectedDecimals } from './operateWithExpectedDecimals.js'

// Operator key
export const OPERATOR = Symbol('SUM')

const addWithExpectedDecimals = operateWithExpectedDecimals('sum')

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
    const presentResults = this.getResultValues(results)

    if (presentResults === false) {
      return false
    }

    return presentResults.reduce((acc, result) =>
      addWithExpectedDecimals(acc, result)
    )
  }
}
