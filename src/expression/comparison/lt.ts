/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { isNumber } from '../../common/type-check'

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('LT')

/**
 * Less than comparison expression
 */
export class LessThan extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} left Left operand.
   * @param {Evaluable} right Right operand.
   */
  constructor (...args: Evaluable[]);
  constructor (left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('<', left, right)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    const left = this.left.evaluate(ctx)
    const right = this.right.evaluate(ctx)
    if (isNumber(left) && isNumber(right)) {
      return (left as number) < (right as number)
    }
    return false
  }
}
