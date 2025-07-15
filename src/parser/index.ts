import { Evaluable, EvaluableType } from '../common/evaluable'
import {
  Divide,
  OPERATOR as OPERATOR_DIVIDE,
} from '../expression/arithmetic/divide'
import {
  Multiply,
  OPERATOR as OPERATOR_MULTIPLY,
} from '../expression/arithmetic/multiply'
import {
  OPERATOR as OPERATOR_SUBTRACT,
  Subtract,
} from '../expression/arithmetic/subtract'
import { OPERATOR as OPERATOR_SUM, Sum } from '../expression/arithmetic/sum'
import { Comparison } from '../expression/comparison'
import { Equal, OPERATOR as OPERATOR_EQ } from '../expression/comparison/eq'
import {
  GreaterThanOrEqual,
  OPERATOR as OPERATOR_GE,
} from '../expression/comparison/ge'
import {
  GreaterThan,
  OPERATOR as OPERATOR_GT,
} from '../expression/comparison/gt'
import { In, OPERATOR as OPERATOR_IN } from '../expression/comparison/in'
import {
  LessThanOrEqual,
  OPERATOR as OPERATOR_LE,
} from '../expression/comparison/le'
import { LessThan, OPERATOR as OPERATOR_LT } from '../expression/comparison/lt'
import { NotEqual, OPERATOR as OPERATOR_NE } from '../expression/comparison/ne'
import {
  NotIn,
  OPERATOR as OPERATOR_NOT_IN,
} from '../expression/comparison/not-in'
import {
  OPERATOR as OPERATOR_OVERLAP,
  Overlap,
} from '../expression/comparison/overlap'
import {
  OPERATOR as OPERATOR_PREFIX,
  Prefix,
} from '../expression/comparison/prefix'
import {
  OPERATOR as OPERATOR_PRESENT,
  Present,
} from '../expression/comparison/present'
import {
  OPERATOR as OPERATOR_SUFFIX,
  Suffix,
} from '../expression/comparison/suffix'
import {
  OPERATOR as OPERATOR_UNDEFINED,
  Undefined,
} from '../expression/comparison/undefined'
import { Logical } from '../expression/logical'
import { And, OPERATOR as OPERATOR_AND } from '../expression/logical/and'
import { Nor, OPERATOR as OPERATOR_NOR } from '../expression/logical/nor'
import { Not, OPERATOR as OPERATOR_NOT } from '../expression/logical/not'
import { OPERATOR as OPERATOR_OR, Or } from '../expression/logical/or'
import { OPERATOR as OPERATOR_XOR, Xor } from '../expression/logical/xor'
import { Operand } from '../operand'
import { Collection } from '../operand/collection'
import { Reference } from '../operand/reference'
import { Value } from '../operand/value'
import { defaultOptions, Options, optionValue } from './options'

// Input types
export type Input =
  | string
  | number
  | boolean
  | null
  | Input[]
  | [string, ...Input[]]
  | Record<string, unknown>
export type ArrayInput = Input[]
export type ExpressionInput = [string, ...Input[]]

const invalidExpression = 'invalid expression'

const logicalIfValidOperands = (
  operands: Evaluable[],
  logical: Logical
): Evaluable => {
  if (
    operands.every(
      (operand) => operand instanceof Logical || operand instanceof Comparison
    )
  ) {
    return logical
  }
  throw new Error(invalidExpression)
}

/**
 * Parser of raw expressions into Evaluable expression
 */
export class Parser {
  private readonly opts: Options
  private readonly expectedRootOperators: Set<string>
  private readonly unexpectedRootSymbols: Set<symbol> = new Set([
    OPERATOR_SUM,
    OPERATOR_SUBTRACT,
    OPERATOR_MULTIPLY,
    OPERATOR_DIVIDE,
  ])
  private readonly referenceCache: Map<string, Reference> = new Map()

  /**
   * @constructor
   * @param {Options?} options Parser options.
   */
  constructor(options?: Partial<Options>) {
    this.opts = { ...defaultOptions }
    // Apply exclusive options overrides
    if (options) {
      for (const key of Object.keys(options)) {
        if (key in this.opts) {
          this.opts[key] = options[key] as optionValue
        }
      }
    }

    this.expectedRootOperators = new Set<string>(
      Array.from(this.opts.operatorMapping.entries())
        .filter(([symbol]) => !this.unexpectedRootSymbols.has(symbol))
        .map(([, operator]) => operator)
    )
  }

  /**
   * Parser options
   * @type {Options}
   */
  get options(): Options {
    return this.opts
  }

  private getReference(key: string): Reference {
    if (this.options.cacheReferences) {
      const cached = this.referenceCache.get(key)
      if (cached) {
        return cached
      }
    }

    const reference = new Reference(this.opts.referenceTransform(key))

    if (this.options.cacheReferences) {
      this.referenceCache.set(key, reference)
    }

    return reference
  }

  private resolve(raw: Input): Value | Reference {
    return this.opts.referencePredicate(raw as string)
      ? this.getReference(raw as string)
      : new Value(raw)
  }

  /**
   * Parse raw expression into evaluable expression.
   * @param {ExpressionInput} raw Raw expression.
   * @return {Evaluable}
   */
  parse(raw: ExpressionInput): Evaluable {
    if (raw === undefined || raw === null || Array.isArray(raw) === false) {
      throw new Error(invalidExpression)
    }

    if (
      (raw as ArrayInput).length === 0 ||
      !this.expectedRootOperators.has(`${(raw as ArrayInput)[0]}`)
    ) {
      throw new Error(invalidExpression)
    }
    return this.parseRawExp(raw as Input)
  }

  /**
   * Parse raw expression based on the expression type.
   * @param {Input} raw Raw expression.
   * @return {Evaluable}
   */
  private parseRawExp(raw: Input): Evaluable {
    // Value / Reference
    if (!Array.isArray(raw)) {
      return this.getOperand(raw)
    }

    let expression: (operands: Evaluable[]) => Evaluable
    let operandParser: (raw: Input) => Evaluable = this.getOperand
    const operator = (raw as ArrayInput)[0] as string
    const operands = (raw as ArrayInput).slice(1)

    /**
     * Simplify the logical expression if possible.
     * - AND, OR with one operand is collapsed, i.e. reduced to inner expression
     *   as the outer logical expression does not change the outcome, e.g.:
     *   [AND, [==, 1, 1]] === [==, 1, 1]
     * - Logical expressions without operands are treated as collection.
     * - Logical expressions with all operands of non array type are treated as
     *   collection, as logical expressions expect inner expressions - array.
     * @param operands
     * @param collapsible
     */
    const logicalExpressionReducer = (
      operands: Evaluable[],
      collapsible = false
    ): Evaluable | undefined => {
      if (
        operands.length === 0 ||
        operands.filter((operand) => operand.type === EvaluableType.Expression)
          .length === 0
      ) {
        return this.getOperand(raw)
      }
      return collapsible && operands.length === 1 ? operands[0] : undefined
    }

    switch (operator) {
      // Logical
      case this.opts.operatorMapping.get(OPERATOR_AND):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands, true) ||
          logicalIfValidOperands(operands, new And(operands))
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_OR):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands, true) ||
          logicalIfValidOperands(operands, new Or(operands))
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_NOR):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands) ||
          logicalIfValidOperands(operands, new Nor(operands))
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_XOR):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands) ||
          logicalIfValidOperands(operands, new Xor(operands))
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_NOT):
        expression = (operands: Evaluable[]): Evaluable =>
          logicalExpressionReducer(operands) ||
          logicalIfValidOperands(operands, new Not(...operands))
        operandParser = this.parseRawExp
        break

      // Comparison
      case this.opts.operatorMapping.get(OPERATOR_EQ):
        expression = (operands: Evaluable[]): Evaluable =>
          new Equal(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_NE):
        expression = (operands: Evaluable[]): Evaluable =>
          new NotEqual(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_GT):
        expression = (operands: Evaluable[]): Evaluable =>
          new GreaterThan(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_GE):
        expression = (operands: Evaluable[]): Evaluable =>
          new GreaterThanOrEqual(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_LT):
        expression = (operands: Evaluable[]): Evaluable =>
          new LessThan(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_LE):
        expression = (operands: Evaluable[]): Evaluable =>
          new LessThanOrEqual(...operands)
        operandParser = this.parseRawExp
        break

      // Containment
      case this.opts.operatorMapping.get(OPERATOR_IN):
        expression = (operands: Evaluable[]): Evaluable => new In(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_NOT_IN):
        expression = (operands: Evaluable[]): Evaluable =>
          new NotIn(...operands)
        break

      // Prefix
      case this.opts.operatorMapping.get(OPERATOR_PREFIX):
        expression = (operands: Evaluable[]): Evaluable =>
          new Prefix(...operands)
        break

      // Suffix
      case this.opts.operatorMapping.get(OPERATOR_SUFFIX):
        expression = (operands: Evaluable[]): Evaluable =>
          new Suffix(...operands)
        break

      // Overlap
      case this.opts.operatorMapping.get(OPERATOR_OVERLAP):
        expression = (operands: Evaluable[]): Evaluable =>
          new Overlap(...operands)
        break

      // Presence
      case this.opts.operatorMapping.get(OPERATOR_UNDEFINED):
        expression = (operands: Evaluable[]): Evaluable =>
          new Undefined(...operands)
        break
      case this.opts.operatorMapping.get(OPERATOR_PRESENT):
        expression = (operands: Evaluable[]): Evaluable =>
          new Present(...operands)
        break

      // Arithmetic
      case this.opts.operatorMapping.get(OPERATOR_SUM):
        expression = (operands: Evaluable[]): Evaluable => new Sum(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_SUBTRACT):
        expression = (operands: Evaluable[]): Evaluable =>
          new Subtract(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_MULTIPLY):
        expression = (operands: Evaluable[]): Evaluable =>
          new Multiply(...operands)
        operandParser = this.parseRawExp
        break
      case this.opts.operatorMapping.get(OPERATOR_DIVIDE):
        expression = (operands: Evaluable[]): Evaluable =>
          new Divide(...operands)
        operandParser = this.parseRawExp
        break

      // Collection
      default:
        return this.getOperand(raw)
    }

    return expression(operands.map(operandParser.bind(this)))
  }

  /**
   * Get resolved operand
   * @param raw Raw data
   */
  private getOperand(raw: Input): Operand {
    if (Array.isArray(raw)) {
      return new Collection(raw.map((item) => this.resolve(item)))
    }
    return this.resolve(raw)
  }
}
