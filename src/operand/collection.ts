import { identity, ifElse, map, pipe, some } from '../common/fp'
import { isString, isUndefined } from '../common/type-check/'
import {
  Evaluable,
  Evaluated,
  isEvaluable,
  SerializeOptions,
} from '../evaluable'

export const KIND = Symbol('collection')

export const isCollection = (evaluable: Evaluable): boolean =>
  evaluable.kind === KIND

export type CollectionSerializeOptions = {
  escapedOperators: Set<string>
  escapeCharacter?: string
}

export const defaultEscapeCharacter = '\\'

export const shouldBeEscaped =
  (options?: CollectionSerializeOptions) =>
  (serialized: unknown): boolean =>
    !isUndefined(options) &&
    isString(serialized) &&
    !isUndefined(options.escapeCharacter) &&
    options.escapedOperators.has(serialized)

export const escapeOperator =
  (options?: CollectionSerializeOptions) =>
  (serialized: unknown): string =>
    !isUndefined(options)
      ? `${options.escapeCharacter}${serialized}`
      : `${serialized}`

export const collection = (items: Evaluable[]): Evaluable => {
  if (!items.length) {
    throw new Error('collection operand must have at least 1 item')
  }

  if (items.some(isCollection)) {
    throw new Error('collection cannot contain nested collection')
  }

  return {
    kind: KIND,
    evaluate: (context) => items.map((item) => item.evaluate(context)),
    simplify: function (context, options) {
      return pipe(
        map((item: Evaluable) => item.simplify(context, options)),
        ifElse(
          some(isEvaluable),
          () => this,
          (evaluated: Evaluated[]) => evaluated
        )
      )(items)
    },
    serialize: (options: SerializeOptions = {}) => [
      ifElse<Evaluated, string, Evaluated>(
        shouldBeEscaped(options.collection),
        escapeOperator(options.collection),
        identity
      )(items[0].serialize(options)),
      ...items.slice(1).map((item) => item.serialize(options)),
    ],
    toString: () => '[' + items.map((item) => item.toString()).join(', ') + ']',
  }
}
