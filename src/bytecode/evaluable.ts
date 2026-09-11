import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
} from '../common/evaluable.js'
import { Input } from '../parser/index.js'
import { CompiledExpression } from './compiler.js'
import { interpret } from './interpreter.js'
import { serialize } from './serializer.js'
import { interpretSimplify } from './simplifier.js'
import { stringify } from './stringifier.js'

export class BytecodeEvaluable implements Evaluable {
  readonly type = EvaluableType.Expression
  constructor(private readonly compiled: CompiledExpression) {}
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

  serialize(): Input {
    return serialize(this.compiled)
  }
  toString(): string {
    return stringify(this.compiled)
  }
}
