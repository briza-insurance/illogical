/**
 * Parser module.
 * @module illogical/parser
 */

import { isString } from '../common/type-check'

// Parser
import { Options, defaultOptions, optionValue } from './options'

// Base
import { Evaluable } from '../common/evaluable'

// Operand
import { Value } from '../operand/value'
import { Reference } from '../operand/reference'
import { Collection } from '../operand/collection'

// Comparison expressions
import {
  Equal,
  OPERATOR as OPERATOR_EQ
} from '../expression/comparison/eq'
import {
  NotEqual,
  OPERATOR as OPERATOR_NE
} from '../expression/comparison/ne'
import {
  GreaterThan,
  OPERATOR as OPERATOR_GT
} from '../expression/comparison/gt'
import {
  GreaterThanOrEqual,
  OPERATOR as OPERATOR_GE
} from '../expression/comparison/ge'
import {
  LessThan,
  OPERATOR as OPERATOR_LT
} from '../expression/comparison/lt'
import {
  LessThanOrEqual,
  OPERATOR as OPERATOR_LE
} from '../expression/comparison/le'
import {
  In,
  OPERATOR as OPERATOR_IN
} from '../expression/comparison/in'
import {
  NotIn,
  OPERATOR as OPERATOR_NOT_IN
} from '../expression/comparison/not-in'
import {
  Prefix,
  OPERATOR as OPERATOR_PREFIX
} from '../expression/comparison/prefix'
import {
  Suffix,
  OPERATOR as OPERATOR_SUFFIX
} from '../expression/comparison/suffix'
import {
  Overlap,
  OPERATOR as OPERATOR_OVERLAP
} from '../expression/comparison/overlap'
import {
  Undefined,
  OPERATOR as OPERATOR_UNDEFINED
} from '../expression/comparison/undefined'

// Logical expressions
import { And, OPERATOR as OPERATOR_AND } from '../expression/logical/and'
import { Or, OPERATOR as OPERATOR_OR } from '../expression/logical/or'
import { Nor, OPERATOR as OPERATOR_NOR } from '../expression/logical/nor'
import { Xor, OPERATOR as OPERATOR_XOR } from '../expression/logical/xor'
import { Not, OPERATOR as OPERATOR_NOT } from '../expression/logical/not'
import { Operand } from '../operand'

// Input types
export type ArrayInput = Array<string | number | boolean | null>
export type Input = string | number | boolean | null | ArrayInput
export type ExpressionInput = [string, ...Input[]]

/**
 * Parser of raw expressions into Evaluable expression
 */
export class Parser {
  private readonly opts: Options
  private readonly expectedOperators: Set<string>

  /**
   * @constructor
   * @param {Options?} options Parser options.
   */
  constructor (options?: Partial<Options>) {
    this.opts = { ...defaultOptions }
    // Apply exclusive options overrides
    if (options) {
      for (const key of Object.keys(options)) {
        if (key in this.opts) {
          this.opts[key] = options[key] as optionValue
        }
      }
    }

    this.expectedOperators = new Set<string>(this.opts.operatorMapping.values())
  }

  /**
   * Parser options
   * @type {Options}
   */
  get options (): Options {
    return this.opts
  }

  /**
   * Parse raw expression into evaluable expression.
   * @param {ExpressionInput} raw Raw expression.
   * @return {Evaluable}
   */
  parse (raw: ExpressionInput): Evaluable {
    if (raw === undefined || raw === null || Array.isArray(raw) === false
    ) {
      throw new Error('invalid expression')
    }

    if ((raw as ArrayInput).length === 0 || !this.expectedOperators.has(`${(raw as ArrayInput)[0]}`)
    ) {
      throw new Error('invalid expression')
    }
    return this.parseRawExp(raw as Input)
  }

  /**
   * Parse raw expression based on the expression type.
   * @param {Input} raw Raw expression.
   * @return {Evaluable}
   */
  private parseRawExp (raw: Input): Evaluable {
    // Value / Reference
    if (!Array.isArray(raw)) {
      return this.getOperand(raw)
    }

    let expression: (operands: Evaluable[]) => Evaluable
    const operator = (raw as ArrayInput)[0] as string
    const operands = (raw as ArrayInput).slice(1)

    /**
     * Simplify the logical expression if possible.
     * @param operands
     */
    const logicalExpressionReducer = (operands: Evaluable[]): Evaluable | undefined =>
      operands.length === 1 ? operands[0] : undefined

    switch (operator) {
      /**
       * Logical
       */
      case this.opts.operatorMapping.get(OPERATOR_AND):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands) || new And(operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_OR):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands) || new Or(operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_NOR):
        expression = (operands: Evaluable[]): Evaluable => new Nor(operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_XOR):
        expression = (operands: Evaluable[]): Evaluable => new Xor(operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_NOT):
        expression = (operands: Evaluable[]): Evaluable => new Not(...operands)
        break
      /**
       * Comparison
       */
      case this.opts.operatorMapping.get(OPERATOR_EQ):
        expression = (operands: Evaluable[]): Evaluable => new Equal(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_NE):
        expression = (operands: Evaluable[]): Evaluable => new NotEqual(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_GT):
        expression = (operands: Evaluable[]): Evaluable => new GreaterThan(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_GE):
        expression = (operands: Evaluable[]): Evaluable => new GreaterThanOrEqual(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_LT):
        expression = (operands: Evaluable[]): Evaluable => new LessThan(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_LE):
        expression = (operands: Evaluable[]): Evaluable => new LessThanOrEqual(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_IN):
        expression = (operands: Evaluable[]): Evaluable => new In(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_NOT_IN):
        expression = (operands: Evaluable[]): Evaluable => new NotIn(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_PREFIX):
        expression = (operands: Evaluable[]): Evaluable => new Prefix(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_SUFFIX):
        expression = (operands: Evaluable[]): Evaluable => new Suffix(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_OVERLAP):
        expression = (operands: Evaluable[]): Evaluable => new Overlap(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_UNDEFINED):
        expression = (operands: Evaluable[]): Evaluable => new Undefined(...operands)
        break
      // Collection
      default:
        return this.getOperand(raw)
    }

    return expression(operands.map((operand) => {
      return this.parseRawExp(operand)
    }))
  }

  /**
   * Get resolved operand
   * @param raw Raw data
   */
  private getOperand (raw: Input): Operand {
    const resolve = (raw: Input): Value | Reference =>
      this.opts.referencePredicate(raw as string)
        ? new Reference(this.opts.referenceTransform(raw as string))
        : new Value(raw)

    if (Array.isArray(raw)) {
      return new Collection(raw.map((item) => resolve(item)))
    }
    return resolve(raw)
  }
}
