import { ifElse } from './common/fp'
import { asExpected } from './common/utils'
import {
  Context,
  Evaluable,
  Evaluated,
  Expression,
  isEvaluable,
} from './evaluable'
import { defaultOptions, Options, overrideOptions } from './options'
import { Parser, parser } from './parser'

export type Illogical = {
  evaluate: (expression: Expression, context: Context) => Evaluated
  parse: (expression: Expression) => Evaluable
  statement: (expression: Expression) => string
  simplify: (
    expression: Expression,
    context: Context,
    ignoredPaths?: (RegExp | string)[]
  ) => Expression
}

export const illogical = (options?: Partial<Options>): Illogical =>
  ((options: Options) =>
    ((parser: Parser, escapedOperators: Set<string>) => ({
      evaluate: (expression: Expression, context: Context) =>
        parser.parse(expression).evaluate(context),
      parse: (expression: Expression) => parser.parse(expression),
      statement: (expression: Expression) =>
        parser.parse(expression).toString(),
      simplify: (
        expression: Expression,
        context: Context,
        ignoredPaths?: (RegExp | string)[]
      ) =>
        ifElse(
          isEvaluable,
          (evaluable) =>
            asExpected<Evaluable>(evaluable).serialize({
              operatorMapping: options.operatorMapping,
              reference: options.serialize.reference,
              collection: {
                escapedOperators,
                ...options.serialize.collection,
              },
            }),
          (expression) => asExpected<Expression>(expression)
        )(
          parser.parse(expression).simplify(context, {
            reference: { ignoredPaths: ignoredPaths ?? [] },
          })
        ),
    }))(parser(options), new Set<string>(options.operatorMapping.values())))(
    overrideOptions(defaultOptions)(options ?? {})
  )
