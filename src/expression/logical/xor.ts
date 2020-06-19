/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

import { Logical } from '../logical'

// Operator key
export const OPERATOR = Symbol('XOR')

/**
 * Logical xor
 * @param {boolean} a
 * @param {boolean} b
 * @return {boolean}
 */
function xor (a: boolean, b: boolean): boolean {
  return (a || b) && !(a && b)
}

/**
 * Xor logical expression
 */
export class Xor extends Logical {
  /**
   * @constructor
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor (operands: Evaluable[]) {
    if (operands.length === 0) {
      throw new Error('logical expression must have at least one operand')
    }
    super('XOR', operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    let res = null
    for (const operand of this.operands) {
      if (res === null) {
        res = operand.evaluate(ctx) as boolean
      } else {
        res = xor(res, operand.evaluate(ctx) as boolean)
      }
    }
    return res
  }
}
