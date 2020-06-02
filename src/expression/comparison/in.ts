/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import {
  Context,
  Result
} from '../../common/evaluable'

import {
  Operand
} from '../../operand'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('IN')

/**
 * In comparison expression
 */
export class In extends Comparison {
  /**
   * @constructor
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (left: Operand, right: Operand) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('in', left, right)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    const left = this.left.evaluate(ctx)
    const right = this.right.evaluate(ctx)
    if (left === undefined || left === null ||
      right === undefined || right === null) {
      return false
    }

    const leftArray = Array.isArray(left)
    const rightArray = Array.isArray(right)
    if (leftArray && rightArray) {
      throw new Error('invalid IN expression, both operands are array')
    }
    if (!leftArray && !rightArray) {
      throw new Error('invalid IN expression, non of the operands is array')
    }
    if (leftArray) {
      return (left as (string|number)[])
        .indexOf(right as string|number) > -1
    }
    return (right as (string|number)[])
      .indexOf(left as string|number) > -1
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    const left = this.left.toString()
    const right = this.right.toString()
    if (left.startsWith('[')) {
      return `(${right} ${this.operator} ${left})`
    }
    return `(${left} ${this.operator} ${right})`
  }
}
