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

// Comparison expressions
import { Comparison } from '../expression/comparison'
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

// Logical expressions
import { Logical } from '../expression/logical'
import { And, OPERATOR as OPERATOR_AND } from '../expression/logical/and'
import { Or, OPERATOR as OPERATOR_OR } from '../expression/logical/or'
import { Nor, OPERATOR as OPERATOR_NOR } from '../expression/logical/nor'
import { Xor, OPERATOR as OPERATOR_XOR } from '../expression/logical/xor'

// Comparison expression operand
type operand = string | number | boolean | null | string[] | number[]

// Raw form of the comparison expression
export type ComparisonRaw = [string, operand, operand]

// Raw form of the logical expression
export type LogicalRaw = [string, ...Array<ComparisonRaw | operand[]>]

/**
 * Void expression
 * Used in the reduction process to eliminate
 * void redundant expressions.
 */
export class VoidExpression implements Evaluable {
  /**
   * Evaluate in the given context
   * @return {boolean}
   */
  evaluate (): boolean {
    return true
  }

  /**
   * @return {string}
   */
  toString (): string {
    return ''
  }
}

/**
 * Parser of raw expressions into Evaluable expression
 */
export class Parser {
  private readonly opts: Options
  private readonly logicalOperator: string[]

  /**
   * @constructor
   * @param {boolean} strict In non-strict mode the parser
   * can perform some expression reduction to optimize the
   * expression. The string from than does not have to have
   * the same structure as the raw expression.
   * @param {Options?} options Parser options.
   */
  constructor (private strict: boolean = false, options?: Partial<Options>) {
    this.opts = { ...defaultOptions }
    // Apply exclusive options overrides
    if (options) {
      for (const key of Object.keys(options)) {
        if (key in this.opts) {
          this.opts[key] = options[key] as optionValue
        }
      }
    }

    // Logical operands map
    this.logicalOperator = [
      this.opts.operatorMapping.get(OPERATOR_AND) as string,
      this.opts.operatorMapping.get(OPERATOR_OR) as string,
      this.opts.operatorMapping.get(OPERATOR_NOR) as string,
      this.opts.operatorMapping.get(OPERATOR_XOR) as string
    ]
  }

  /**
   * Parser options
   * @type {Options}
   */
  get options (): Options {
    return this.opts
  }

  /**
   * Parse raw expression into evaluable expression
   * @param {ComparisonRaw | LogicalRaw} raw expression
   * @return {Evaluable}
   */
  parse (raw: ComparisonRaw | LogicalRaw): Evaluable {
    if (raw === undefined || raw === null ||
      Array.isArray(raw) === false || raw.length === 0 ||
      isString(raw[0] as string) === false) {
      throw new Error('invalid expression')
    }
    if (this.logicalOperator.includes(raw[0] as string)) {
      return this.parseLogicalRawExp(raw as LogicalRaw)
    }
    return this.parseComparisonRawExp(raw as ComparisonRaw)
  }

  /**
   * Parse raw logical expression
   * @param {LogicalRaw} raw expression
   * @return {Logical|Comparison|null}
   */
  parseLogicalRawExp (raw: LogicalRaw): Logical | Comparison | Evaluable {
    if (raw.length === 0) {
      if (this.strict) {
        throw new Error('invalid logical expression')
      }
      return new VoidExpression()
    }
    if (raw.length === 2) {
      if (this.strict || raw[1].length === 0) {
        throw new Error('invalid logical expression, ' +
          'there must be the operator and at least two operands.')
      }
      if (this.logicalOperator.includes(raw[1][0] as string)) {
        return this.parseLogicalRawExp(raw[1] as LogicalRaw)
      } else {
        return this.parseComparisonRawExp(raw[1] as ComparisonRaw)
      }
    }

    let logical: Logical
    switch (raw[0]) {
      case this.opts.operatorMapping.get(OPERATOR_AND):
        logical = new And([])
        break
      case this.opts.operatorMapping.get(OPERATOR_OR):
        logical = new Or([])
        break
      case this.opts.operatorMapping.get(OPERATOR_NOR):
        logical = new Nor([])
        break
      case this.opts.operatorMapping.get(OPERATOR_XOR):
        logical = new Xor([])
        break
      default:
        throw new Error(`invalid logical operator: "${raw[0]}"`)
    }

    for (const section of raw.filter((_, index) => index > 0)) {
      if (this.logicalOperator.includes(section[0] as string)) {
        logical.add(
          this.parseLogicalRawExp(section as LogicalRaw) as Logical | Comparison
        )
      } else {
        logical.add(this.parseComparisonRawExp(section as ComparisonRaw))
      }
    }

    return logical
  }

  /**
   * Parse raw comparison expression
   * @param {ComparisonRaw} raw
   * @return {Comparison}
   */
  parseComparisonRawExp (raw: ComparisonRaw): Comparison {
    if (raw.length !== 3) {
      throw new Error(`invalid comparison expression: "${raw}"`)
    }

    // Get value or reference for left and right side of the expression
    const left = this.opts.referencePredicate(raw[1] as string)
      ? new Reference(this.opts.referenceTransform(raw[1] as string))
      : new Value(raw[1])

    const right = this.opts.referencePredicate(raw[2] as string)
      ? new Reference(this.opts.referenceTransform(raw[2] as string))
      : new Value(raw[2])

    // Create the expression based on the operator mapping
    switch (raw[0]) {
      case this.opts.operatorMapping.get(OPERATOR_EQ):
        return new Equal(left, right)
      case this.opts.operatorMapping.get(OPERATOR_NE):
        return new NotEqual(left, right)
      case this.opts.operatorMapping.get(OPERATOR_GT):
        return new GreaterThan(left, right)
      case this.opts.operatorMapping.get(OPERATOR_GE):
        return new GreaterThanOrEqual(left, right)
      case this.opts.operatorMapping.get(OPERATOR_LT):
        return new LessThan(left, right)
      case this.opts.operatorMapping.get(OPERATOR_LE):
        return new LessThanOrEqual(left, right)
      case this.opts.operatorMapping.get(OPERATOR_IN):
        return new In(left, right)
      case this.opts.operatorMapping.get(OPERATOR_NOT_IN):
        return new NotIn(left, right)
      default:
        throw new Error(`invalid comparison operator: "${raw[0]}"`)
    }
  }
}
