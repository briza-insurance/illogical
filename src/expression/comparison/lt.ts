/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
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
  constructor(...args: Evaluable[]);
  constructor (left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('<', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison (left: Result, right: Result): boolean {
    const operand = (value: Result) =>
      this.strict ? value : this.toNumber(value)

    if (isNumber(operand(left)) && isNumber(operand(right))) {
      return (left as number) < (right as number)
    }

    return false
  }
}
