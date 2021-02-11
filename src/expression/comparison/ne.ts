/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { isNumber } from '../../common/type-check'
import { toNumber } from '../../common/util'
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
  constructor(...args: Evaluable[]);
  constructor (left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('!=', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison (left: Result, right: Result): boolean {
    const operand = (value: Result) => (this.strict ? value : toNumber(value))
    return operand(left) !== operand(right)
  }
}
