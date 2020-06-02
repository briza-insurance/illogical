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
export const OPERATOR = Symbol('NE')

/**
 * Not equal comparison expression
 */
export class NotEqual extends Comparison {
  /**
   * @constructor
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (left: Operand, right: Operand) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('!=', left, right)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    return this.left.evaluate(ctx) !==
      this.right.evaluate(ctx)
  }
}
