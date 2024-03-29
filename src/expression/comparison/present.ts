import { Evaluable, Result } from '../../common/evaluable'
import { Value } from '../../operand/value'
import { ExpressionInput } from '../../parser'
import { Options } from '../../parser/options'
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
  constructor(...args: Evaluable[])
  constructor(operand: Evaluable) {
    if (arguments.length !== 1) {
      throw new Error(
        'comparison expression PRESENT expects exactly one operand'
      )
    }
    super('PRESENT', OPERATOR, operand, new Value(true))
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result): boolean {
    return left !== undefined && left !== null
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString(): string {
    return `(${this.left.toString()} is ${this.operator})`
  }

  serialize(options: Options): ExpressionInput {
    const { operatorMapping } = options
    const operator = operatorMapping.get(this.operatorSymbol)
    if (operator === undefined) {
      throw new Error(`missing operator ${this.operatorSymbol.toString()}`)
    }
    return [operator, this.left.serialize(options)]
  }
}
