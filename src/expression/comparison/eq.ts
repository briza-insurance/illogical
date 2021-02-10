/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('EQ')

/**
 * Equal comparison expression
 */
export class Equal extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} left Left operand.
   * @param {Evaluable} right Right operand.
   */
  constructor(...args: Evaluable[]);
  constructor (left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('==', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison (left: Result, right: Result): boolean {
    if (!this.strict) {
      left = this.toNumber(left)
      right = this.toNumber(right)
      if (isNumber(left) && isNumber(right)) {
        return left === right
      }
    }
    return left === right
  }
}
