/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('OVERLAP')

/**
 * Overlap comparison expression
 */
export class Overlap extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} left Left operand.
   * @param {Evaluable} right Right operand.
   */
  constructor (...args: Evaluable[]);
  constructor (left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('overlap', left, right)
  }

  comparison (left: Result, right: Result): boolean {
    if (left === undefined || left === null ||
      right === undefined || right === null) {
      return false
    }

    if (!Array.isArray(left) || !Array.isArray(right)) {
      throw new Error('invalid OVERLAP expression, both operands must be array')
    }

    const leftArray = left as (string|number)[]
    const rightArray = right as (string|number)[]
    return leftArray.some((element) => rightArray.includes(element))
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    const left = this.left.toString()
    const right = this.right.toString()
    return `(${left} ${this.operator} ${right})`
  }
}
