/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable'
import { isEvaluable } from '../../common/type-check'
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
  evaluate (ctx: Context): Result {
    return this.comparison(this.left.evaluate(ctx), this.right.evaluate(ctx))
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`
  }

  abstract comparison (left: Result, right: Result): boolean

  simplify (...args: [Context]): Result | Evaluable {
    const left = this.left.simplify(...args)
    const right = this.right.simplify(...args)
    if (!isEvaluable(left) && !isEvaluable(right)) {
      return this.comparison(left, right)
    }
    return this
  }
}
