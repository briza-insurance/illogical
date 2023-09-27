import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
import { toDateNumber } from '../../common/util'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('GT')

/**
 * Greater than comparison expression
 */
export class GreaterThan extends Comparison {
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
    super('>', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result, right: Result): boolean {
    if (isNumber(left) && isNumber(right)) {
      return (left as number) > (right as number)
    }

    const leftDate = toDateNumber(left),
      rightDate = toDateNumber(right)
    if (leftDate && rightDate) {
      return leftDate > rightDate
    }

    return false
  }
}
