/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { isNumber } from '../../common/type-check'

import {
  Context,
  Result
} from '../../common/evaluable'

import {
  Operand
} from '../../operand'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('LE')

/**
 * Less than or equal comparison expression
 */
export class LessThanOrEqual extends Comparison {
  /**
   * @constructor
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (left: Operand, right: Operand) {
    super('<=', left, right)
  }

  /**
   * Evaluate in the given context
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    const left = this.left.evaluate(ctx)
    const right = this.right.evaluate(ctx)
    if (isNumber(left) && isNumber(right)) {
      return (left as number) <= (right as number)
    }
    return false
  }
}
