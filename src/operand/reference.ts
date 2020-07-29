/**
 * Operand module.
 * @module illogical/operand
 */

import { Context, Result } from '../common/evaluable'
import { isObject } from '../common/type-check'
import { Operand } from '.'

/**
 * Lookup for the reference in the context.
 * The nested context value is annotated with "." delimiter.
 * @example address.city
 * @param {Context} ctx
 * @param {string} key Context lookup key.
 * @return {Result}
 */
function contextValueLookup (ctx: Context, key: string): Result {
  let keys = [key]

  // Nested reference
  if (key.includes('.')) {
    keys = key.split('.')
  }

  // Context pointer
  let pointer = ctx

  for (let i = 0; i < keys.length; i++) {
    // Last node
    if (i === keys.length - 1) {
      if (keys[i] in pointer) {
        return pointer[keys[i]] as Result
      }
      // Nested path
    } else if (keys[i] in pointer && isObject(pointer[keys[i]])) {
      pointer = pointer[keys[i]] as Context

      // Invalid nested reference path
    } else {
      break
    }
  }

  return undefined
}

/**
 * Reference operand resolved within the context
 */
export class Reference extends Operand {
  private readonly key: string

  /**
   * @constructor
   * @param {string} key Context key.
   */
  constructor (key: string) {
    if (key.trim() === '') {
      throw new Error('invalid reference key')
    }
    super()
    this.key = key
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate (ctx: Context): Result {
    return contextValueLookup(ctx, this.key)
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString (): string {
    return `{${this.key}}`
  }
}
