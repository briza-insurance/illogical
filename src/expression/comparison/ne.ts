/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('NE')

/**
 * Not equal comparison expression
 */
export class NotEqual extends Comparison {
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
