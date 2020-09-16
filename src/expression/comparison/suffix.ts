/**
 * Suffix expression module.
 * @module illogical/expression/suffix
 */

import { Evaluable, Result } from '../../common/evaluable'
import { isString } from '../../common/type-check'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('PREFIX')

/**
 * Suffix comparison expression
 */
export class Suffix extends Comparison {
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
    super('suffix', OPERATOR, left, right)
  }

  comparison (left: Result, right: Result): boolean {
    if (isString(left) === false || isString(right) === false) {
      return false
    }
    return (left as string).endsWith(right as string)
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    const left = this.left.toString()
    const right = this.right.toString()
    return `(${left}<${right}>)`
  }
}
