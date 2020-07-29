/**
 * Operand module.
 * @module illogical/operand
 */

import { Context, Result } from '../common/evaluable'
import { Operand } from '.'
import { Reference } from './reference'
import { Value } from './value'

/**
 * Collection operand resolved containing mixture of value and references.
 */
export class Collection extends Operand {
  private readonly items: Array<Value | Reference>

  /**
   * @constructor
   * @param {Operand[]} items Collection of operands.
   */
  constructor (items: Array<Value | Reference>) {
    super()
    this.items = items
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate (ctx: Context): Result {
    return this.items.map((item) => item.evaluate(ctx)) as []
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString (): string {
    return '[' + this.items.map((item) => item.toString()).join(', ') + ']'
  }
}
