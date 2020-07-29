/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable'
import { Operand } from '../../operand'

/**
 * Abstract comparison expression
 */
export abstract class Comparison implements Evaluable {
  type: EvaluableType = EvaluableType.Expression
  protected operator: string
  protected left: Operand
  protected right: Operand

  /**
   * @constructor
   * @param {string} operator String representation of the operator.
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (operator: string, left: Operand, right: Operand) {
    this.operator = operator
    this.left = left
    this.right = right
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
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`
  }
}
