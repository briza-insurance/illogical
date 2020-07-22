/**
 * Present expression module.
 * @module illogical/expression/comparison
 */

import { Comparison } from './index'
import { Context, Evaluable, Result } from '../../common/evaluable'
import { Value } from '../../operand/value'

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

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    return this.left.evaluate(ctx) !== undefined && this.left.evaluate(ctx) !== null
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return `(${this.left.toString()} is ${this.operator})`
  }
}
