import { Evaluable, Result } from '../../common/evaluable'
import { areAllNumbers } from '../../common/type-check'
import { Operand } from '../../operand'
import { Arithmetic } from '.'

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
    if (!areAllNumbers(results)) {
      throw new Error('operands must be numbers for divide')
    }

    const result = results.reduce((acc, result) => acc / result)

    return result
  }
}
