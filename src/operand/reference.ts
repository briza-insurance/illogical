/**
 * Operand module.
 * @module illogical/operand
 */

import {
  Context,
  Result
} from '../common/evaluable'

import {
  Operand
} from '.'

/**
 * Reference operand resolved within the context
 */
export class Reference implements Operand {
  private readonly key: string

  /**
   * @constructor
   * @param {string} key Context key
   */
  constructor (key: string) {
    if (key.trim() === '') {
      throw new Error('invalid reference key')
    }
    this.key = key
  }

  /**
   * Evaluate in the given context
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate (ctx: Context): Result {
    if (this.key in ctx) {
      return ctx[this.key]
    }
    return undefined
  }

  /**
   * Get the strict representation of the operand
   * @return {string}
   */
  toString (): string {
    return `{${this.key}}`
  }
}
