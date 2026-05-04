import { Context, Result } from '../common/evaluable.js'
import { ExpressionInput } from '../parser/index.js'
import { CompiledExpression } from './compiler.js'
import { interpret } from './interpreter.js'
import { interpretSimplify } from './simplifier.js'

/**
 * Bytecode wrapper that provides a consistent interface for bytecode execution.
 */
export class BytecodeEvaluable {
  constructor(private readonly compiled: CompiledExpression) {}

  evaluate(ctx: Context): Result {
    return interpret(this.compiled, ctx)
  }

  simplify(
    ctx: Context,
    strictKeys?: string[] | Set<string>,
    optionalKeys?: string[] | Set<string>
  ): Result | ExpressionInput {
    return interpretSimplify(this.compiled, ctx, strictKeys, optionalKeys)
  }
}
