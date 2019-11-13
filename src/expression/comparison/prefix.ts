/**
 * Prefix expression module.
 * @module illogical/expression/prefix
 */

import {
  Context,
  Result
} from '../../common/evaluable'

import {
  Operand
} from '../../operand'
import { Comparison } from '../comparison'
import { isString } from '../../common/type-check'

// Operator key
export const OPERATOR = Symbol('PREFIX')

/**
 * Prefix comparison expression
 */
export class Prefix extends Comparison {
  /**
   * @constructor
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (left: Operand, right: Operand) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression must have at left and right operands')
    }
    super('prefix', left, right)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    const left = this.left.evaluate(ctx)
    const right = this.right.evaluate(ctx)
    if (isString(left) === false || isString(right) === false) {
      return false
    }
    return (right as string).startsWith(left as string)
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    const left = this.left.toString()
    const right = this.right.toString()
    return `<${left}>${right}`
  }
}
