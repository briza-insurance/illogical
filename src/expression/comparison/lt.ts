import { Evaluable, Result } from '../../common/evaluable.js'
import { isNumber } from '../../common/type-check.js'
import { toDateNumber } from '../../common/util.js'
import { Comparison } from '../comparison/index.js'
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
  constructor(...args: Evaluable[])
  constructor(left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('<', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result, right: Result): boolean {
    if (isNumber(left) && isNumber(right)) {
      return left < right
    }

    const leftDate = toDateNumber(left),
      rightDate = toDateNumber(right)
    if (leftDate && rightDate) {
      return leftDate < rightDate
    }

    return false
  }
}
