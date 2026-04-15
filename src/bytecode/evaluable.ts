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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: Context,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _strictKeys?: string[] | Set<string>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _optionalKeys?: string[] | Set<string>
  ): never {
    throw new Error('simplify is not supported for bytecode evaluables')
  }
  serialize(options: Options): Input {
    return this.delegate.serialize(options)
  }
  toString(): string {
    return this.delegate.toString()
  }
}
