/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable'

/**
 * Abstract logical expression
 */
export abstract class Logical implements Evaluable {
  type: EvaluableType = EvaluableType.Expression
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

  abstract evaluate (ctx: Context): Result

  abstract simplify (ctx: Context): Result | Evaluable

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return '(' + this.operands.map((operand) => operand.toString()).join(` ${this.operator} `) + ')'
  }
}
