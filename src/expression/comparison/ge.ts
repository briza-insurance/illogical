/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
import { Comparison, ComparisonOptions } from '../comparison'

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
  private options: ComparisonOptions;
  constructor(options: ComparisonOptions, ...args: Evaluable[]);
  constructor (options: ComparisonOptions, left: Evaluable, right: Evaluable) {
    if (arguments.length !== 3) {
      throw new Error(
        'comparison expression expects options, left and right operands'
      )
    }
    super('>=', OPERATOR, left, right)
    this.options = options
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison (left: Result, right: Result): boolean {
    if (isNumber(left) && isNumber(right)) {
      return left >= right
    }

    // check if {allowCrossTypeParsing} is allowed
    if (this.options.allowCrossTypeParsing) {
      left = this.parseable(left)
      right = this.parseable(right)
      if (isNumber(left) && isNumber(right)) {
        return left >= right
      }
    }

    return false
  }
}
