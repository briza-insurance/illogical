/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
<<<<<<< Updated upstream
import { isNumber, isString } from '../../common/type-check'
=======
import { isNumber, isString } from '../../common/type-check'
>>>>>>> Stashed changes
import { toNumber } from '../../common/util'
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
  constructor(...args: Evaluable[]);
  constructor (left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('>=', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison (left: Result, right: Result): boolean {
    const operand = (value: Result) => (this.strict ? value : toNumber(value))

    if (isNumber(operand(left)) && isNumber(operand(right))) {
      return (left as number) >= (right as number)
    } else if (isString(left) && isString(right)) {
      return (left as string) >= (right as string)
    }

    return false
  }
}
