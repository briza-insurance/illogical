import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
} from '../common/evaluable.js'
import { Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { CompiledExpression } from './compiler.js'
import { interpret } from './interpreter.js'
import { interpretSimplify } from './simplifier.js'

export class BytecodeEvaluable implements Evaluable {
  readonly type = EvaluableType.Expression
  constructor(
    private readonly compiled: CompiledExpression,
    private readonly delegate: Evaluable
  ) {}
  evaluate(ctx: Context): Result {
    return interpret(this.compiled, ctx)
  }
  simplify(
    ctx: Context,
    strictKeys?: string[] | Set<string>,
    optionalKeys?: string[] | Set<string>
  ): Result | Input {
    return interpretSimplify(this.compiled, ctx, strictKeys, optionalKeys)
  }
  serialize(options: Options): Input {
    return this.delegate.serialize(options)
  }
  toString(): string {
    return this.delegate.toString()
  }
}
