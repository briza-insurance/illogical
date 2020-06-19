/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import { Nor } from './nor'
import { Value } from '../../operand/value'
import { Evaluable } from '../../common/evaluable'

// Operator key
export const OPERATOR = Symbol('NOT')

/**
 * Not logical expression
 */
export class Not extends Nor {
  /**
   * @constructor
   * @param {Evaluable} operand
   */
  constructor (...args: Evaluable[]);
  constructor (operand: Evaluable) {
    if (arguments.length !== 1) {
      throw new Error('logical NOT expression must have exactly one operand')
    }
    super([operand, new Value(false)])
    this.operator = 'NOT'
  }
}
