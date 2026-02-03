import { Evaluable, Result } from '../../common/evaluable.js'
import { Operand } from '../../operand/index.js'
import { Arithmetic } from './index.js'

// Operator key
export const OPERATOR = Symbol('DIVIDE')

/**
 * Divide operation expression
 */
export class Divide extends Arithmetic {
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
      throw new Error('divide expression requires at least 2 operands')
    }
    super('/', OPERATOR, operands)
  }

  operate(results: Result[]): Result {
    const presentResults = this.getResultValues(results)

    if (presentResults === false) {
      return false
    }

    return presentResults.reduce((acc, result) => acc / result)
  }
}
