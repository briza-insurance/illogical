/**
 * Undefined expression module.
 * @module illogical/expression/comparison
 */

import {
  Context,
  Result
} from '../../common/evaluable'

import {
  Operand
} from '../../operand'
import { Predicate } from '.'

// Operator key
export const OPERATOR = Symbol('UNDEFINED')

/**
 * Undefined predicate expression
 */
export class Undefined extends Predicate {
  /**
   * @constructor
   * @param {Operand} operand
   */
  constructor (operand: Operand) {
    if (arguments.length !== 1) {
      throw new Error('predicate expression expect one operand')
    }
    super('UNDEFINED', operand)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    return this.operand.evaluate(ctx) === undefined
  }
}
