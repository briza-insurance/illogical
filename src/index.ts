/**
 * Main module.
 * @module illogical
 */

import { compile, CompiledExpression } from './bytecode/compiler.js'
import { BytecodeEvaluable } from './bytecode/evaluable.js'
import { interpret } from './bytecode/interpreter.js'
import { interpretSimplify } from './bytecode/simplifier.js'
import { Context } from './common/evaluable.js'
import { isBoolean } from './common/type-check.js'
import {
  OPERATOR_AND,
  OPERATOR_DIVIDE,
  OPERATOR_EQ,
  OPERATOR_GE,
  OPERATOR_GT,
  OPERATOR_IN,
  OPERATOR_LE,
  OPERATOR_LT,
  OPERATOR_MULTIPLY,
  OPERATOR_NE,
  OPERATOR_NOR,
  OPERATOR_NOT,
  OPERATOR_NOT_IN,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
  OPERATOR_PREFIX,
  OPERATOR_PRESENT,
  OPERATOR_SUBTRACT,
  OPERATOR_SUFFIX,
  OPERATOR_SUM,
  OPERATOR_UNDEFINED,
  OPERATOR_XOR,
} from './operator.js'
import { ExpressionInput, Input } from './parser/index.js'
import { defaultOptions, Options } from './parser/options.js'

export { defaultOptions } from './parser/options.js'
export {
  isBoolean,
  OPERATOR_EQ,
  OPERATOR_NE,
  OPERATOR_GT,
  OPERATOR_GE,
  OPERATOR_LT,
  OPERATOR_LE,
  OPERATOR_IN,
  OPERATOR_NOT_IN,
  OPERATOR_PREFIX,
  OPERATOR_SUFFIX,
  OPERATOR_OVERLAP,
  OPERATOR_UNDEFINED,
  OPERATOR_PRESENT,
  OPERATOR_AND,
  OPERATOR_OR,
  OPERATOR_NOR,
  OPERATOR_XOR,
  OPERATOR_NOT,
  OPERATOR_DIVIDE,
  OPERATOR_MULTIPLY,
  OPERATOR_SUBTRACT,
  OPERATOR_SUM,
}
export type { Context, ExpressionInput, Input, Options }

const unexpectedResultError =
  'non expression or boolean result should be returned'

/**
 * Condition engine — bytecode-only evaluator.
 * Expressions are compiled to bytecode and interpreted at runtime.
 */
class Engine {
  private readonly parserOptions: Options
  private readonly bytecodeCache: WeakMap<ExpressionInput, CompiledExpression> =
    new WeakMap()

  /**
   * @constructor
   * @param {Partial<Options>?} options Parser options.
   */
  constructor(options?: Partial<Options>) {
    this.parserOptions = { ...defaultOptions, ...options }
  }

  private getCompiled(exp: ExpressionInput): CompiledExpression {
    let compiled = this.bytecodeCache.get(exp)
    if (compiled === undefined) {
      compiled = compile(exp, this.parserOptions)
      this.bytecodeCache.set(exp, compiled)
    }
    return compiled
  }

  /**
   * Evaluate the expression.
   * @param {ExpressionInput} exp Raw expression.
   * @param {Context} ctx Evaluation data context.
   * @return {boolean}
   */
  evaluate(exp: ExpressionInput, ctx: Context): boolean {
    const result = interpret(this.getCompiled(exp), ctx)
    if (isBoolean(result)) {
      return result
    }
    throw new Error(unexpectedResultError)
  }

  /**
   * Parse expression into a bytecode-evaluable wrapper.
   * @param {ExpressionInput} exp Raw expression.
   * @return {BytecodeEvaluable}
   */
  parse(exp: ExpressionInput): BytecodeEvaluable {
    return new BytecodeEvaluable(this.getCompiled(exp))
  }

  /**
   * Simplifies an expression with values in context.
   *
   * This method tries to evaluate all the expressions and reduce them to its corresponding boolean value.
   * If a value required for the expression is not present in the context, the minimal corresponding expression
   * will be returned.
   *
   * @param {ExpressionInput} exp  Raw expression.
   * @param {Context} context Evaluation data context.
   * @param {string[] | Set<string>} strictKeys keys to be considered present even if they are not present in the
   *  context. Passing as a Set is recommended for performance reasons.
   * @param {string[] | Set<string>} optionalKeys keys to be considered not present unless they are in the context or in
   *  `strictKeys`; when `strictKeys` is `undefined` and `optionalKeys` is an array, every key that is not in
   *  `optionalKeys` is considered to be present and thus will be evaluated. Passing as a Set is recommended for
   *  performance reasons.
   * @returns {Input | boolean}
   */
  simplify(
    exp: ExpressionInput,
    context: Context,
    strictKeys?: string[] | Set<string>,
    optionalKeys?: string[] | Set<string>
  ): Input | boolean {
    const result = interpretSimplify(
      this.getCompiled(exp),
      context,
      strictKeys,
      optionalKeys
    )
    if (typeof result === 'boolean') {
      return result
    }
    return result
  }
}

export default Engine
