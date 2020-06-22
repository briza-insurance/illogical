/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

/**
 * Abstract logical expression
 */
export abstract class Logical implements Evaluable {
  protected operator: string
  protected operands: Evaluable[]

  /**
   * @constructor
   * @param {string} operator String representation of the operator.
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor (operator: string, operands: Evaluable[]) {
    this.operator = operator
    this.operands = operands
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   */
  evaluate (ctx: Context): Result { // eslint-disable-line @typescript-eslint/no-unused-vars
    throw new Error('not implemented exception')
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return '(' + this.operands.map(
      (operand) => operand.toString()).join(` ${this.operator} `) +
    ')'
  }
}
