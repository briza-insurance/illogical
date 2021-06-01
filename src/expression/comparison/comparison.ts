import { ifElse, map, not, pipe, some } from '../../common/fp'
import { isUndefined } from '../../common/type-check/'
import { Optional } from '../../common/types'
import { hasOwnProperty } from '../../common/utils'
import { Context, Evaluable, Evaluated, isEvaluable } from '../../evaluable'

export type Comparison = Omit<Evaluable, 'evaluate'> & {
  operator: string
  operands: Evaluable[]
  evaluate(context: Context): boolean
  comparison(...results: Evaluated[]): boolean
}

export const comparison = (
  evaluable: Omit<
    Optional<Comparison, 'toString'>,
    'serialize' | 'simplify' | 'evaluate'
  >
): Comparison => ({
  ...evaluable,
  evaluate: (context) =>
    evaluable.comparison(
      ...evaluable.operands.map((operand) => operand.evaluate(context))
    ),
  serialize: (options = {}) =>
    ifElse<string | undefined, undefined, Evaluated>(
      isUndefined,
      () => {
        throw new Error(`missing mapping for ${evaluable.operator} operator`)
      },
      (kind) => [
        kind,
        ...evaluable.operands.map((operand) => operand.serialize(options)),
      ]
    )((options.operatorMapping ?? new Map()).get(evaluable.kind)),
  simplify: function (context, option) {
    return pipe(
      map((operand: Evaluable) => operand.simplify(context, option)),
      ifElse(
        not(some(isEvaluable)),
        (simplified: Evaluated[]) => evaluable.comparison(...simplified),
        () => this
      )
    )(evaluable.operands)
  },
  toString: hasOwnProperty(evaluable, 'toString')
    ? evaluable.toString
    : () =>
        `(${evaluable.operands[0].toString()} ${
          evaluable.operator
        } ${evaluable.operands
          .slice(1)
          .map((operand) => operand.toString())
          .join(', ')})`,
})
