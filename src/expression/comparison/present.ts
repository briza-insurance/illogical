/**
 * Present expression module.
 * @module illogical/expression/comparison
 */

import { Evaluable, Result } from '../../common/evaluable'
import { Value } from '../../operand/value'
import { Comparison } from './index'

// Operator key
export const OPERATOR = Symbol('PRESENT')

/**
 * Present comparison expression
 */
export class Present extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} operand
   */
  constructor (...args: Evaluable[]);
  constructor (operand: Evaluable) {
    if (arguments.length !== 1) {
      throw new Error('comparison expression PRESENT expects exactly one operand')
    }
    super('PRESENT', operand, new Value(true))
  }

  comparison (left: Result): boolean {
    return left !== undefined && left !== null
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return `(${this.left.toString()} is ${this.operator})`
  }
}
