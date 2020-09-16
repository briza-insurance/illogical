/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('LE')

/**
 * Less than or equal comparison expression
 */
export class LessThanOrEqual extends Comparison {
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
    super('<=', left, right)
  }

  comparison (left: Result, right: Result): boolean {
    if (isNumber(left) && isNumber(right)) {
      return (left as number) <= (right as number)
    }
    return false
  }
}
