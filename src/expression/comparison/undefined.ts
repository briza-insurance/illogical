/**
 * Undefined expression module.
 * @module illogical/expression/comparison
 */

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

import { Comparison } from '../comparison'
import { Value } from '../../operand/value'

// Operator key
export const OPERATOR = Symbol('UNDEFINED')

/**
 * Undefined predicate expression
 */
export class Undefined extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} operand
   */
  constructor (...args: Evaluable[]);
  constructor (operand: Evaluable) {
    if (arguments.length !== 1) {
      throw new Error('comparison expression UNDEFINED expects exactly one operand')
    }
    super('UNDEFINED', operand, new Value(true))
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    return this.left.evaluate(ctx) === undefined
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return `(${this.left.toString()} is ${this.operator})`
  }
}
