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
export const OPERATOR = Symbol('EQ')

/**
 * Equal comparison expression
 */
export class Equal extends Comparison {
  /**
   * @constructor
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (left: Operand, right: Operand) {
    super('==', left, right)
  }

  /**
   * Evaluate in the given context
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    return this.left.evaluate(ctx) ===
      this.right.evaluate(ctx)
  }
}
