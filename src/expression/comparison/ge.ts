import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('GE')

/**
 * Greater than or equal comparison expression
 */
export class GreaterThanOrEqual extends Comparison {
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
    super('>=', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result, right: Result): boolean {
    if (isNumber(left) && isNumber(right)) {
      return (left as number) >= (right as number)
    }
    return false
  }
}
