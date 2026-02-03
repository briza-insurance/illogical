import { Evaluable, Result } from '../../common/evaluable.js'
import { Comparison } from '../comparison/index.js'

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
  constructor(...args: Evaluable[])
  constructor(left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('==', OPERATOR, left, right)
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result, right: Result): boolean {
    return left === right
  }
}
