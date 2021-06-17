/* eslint-disable @typescript-eslint/no-use-before-define */
import { Options } from '../'
import { isString, isUndefined } from '../common/type-check/'
import { asExpected } from '../common/utils'
import { Evaluable, isEvaluatedPrimitive, OperatorMapping } from '../evaluable'
import {
  Comparison,
  eq,
  ge,
  gt,
  In,
  KIND_EQ,
  KIND_GE,
  KIND_GT,
  KIND_IN,
  KIND_LE,
  KIND_LT,
  KIND_NE,
  KIND_NOT_IN,
  KIND_OVERLAP,
  KIND_PREFIX,
  KIND_PRESENT,
  KIND_SUFFIX,
  KIND_UNDEF,
  le,
  lt,
  ne,
  notIn,
  overlap,
  prefix,
  present,
  suffix,
  undef,
} from '../expression/comparison'
import {
  and,
  KIND_AND,
  KIND_NOR,
  KIND_NOT,
  KIND_OR,
  KIND_XOR,
  Logical,
  nor,
  not,
  or,
  xor,
} from '../expression/logical'
import { collection, reference, value } from '../operand'
import { ReferenceSerializeOptions } from '../operand/reference'

export interface Parser {
  parse: (expression: unknown) => Evaluable
}

type LogicalOrComparison = (...operands: Evaluable[]) => Logical | Comparison

type ParsingOptions = {
  operatorExpressionMapping: Map<string, LogicalOrComparison>
  referenceSerializeOptions: ReferenceSerializeOptions
  escapeCharacter?: string
}

export const toReferencePath = (
  value: unknown,
  options: ReferenceSerializeOptions
): string | undefined => (isString(value) ? options.from(value) : undefined)

export const isEscaped = (value: unknown, escapeCharacter?: string): boolean =>
  !isUndefined(escapeCharacter) &&
  isString(value) &&
  value.startsWith(escapeCharacter)

export const createOperand = (
  input: unknown | unknown[],
  options: ParsingOptions
): Evaluable => {
  if (isUndefined(input)) {
    throw new Error('invalid undefined operand')
  }

  if (Array.isArray(input)) {
    if (!input.length) {
      throw new Error('invalid undefined operand')
    }
    return collection(input.map(parse(options)))
  }

  const referencePath = toReferencePath(
    input,
    options.referenceSerializeOptions
  )
  if (referencePath) {
    return reference(referencePath)
  }

  if (!isEvaluatedPrimitive(input)) {
    throw new Error(`invalid operand, ${input}`)
  }

  return value(input)
}

export const createExpression = (
  expression: unknown[],
  options: ParsingOptions
): Logical | Comparison | undefined => {
  const [operator, ...operands] = expression
  const evaluable = options.operatorExpressionMapping.get(`${operator}`)

  if (evaluable) {
    return evaluable(...operands.map(parse(options)))
  }
}

export const parse =
  (options: ParsingOptions) =>
  (expression: unknown | unknown[]): Evaluable => {
    if (!Array.isArray(expression) || expression.length < 2) {
      return createOperand(expression, options)
    }

    const [first, ...rest] = expression
    if (isEscaped(first, options.escapeCharacter)) {
      return createOperand([first.slice(1), ...rest], options)
    }

    return (
      createExpression(expression, options) ??
      createOperand(expression, options)
    )
  }

export const operatorExpressionMapping = (
  operatorMapping: OperatorMapping
): Map<string, LogicalOrComparison> =>
  new Map(
    asExpected<[string, LogicalOrComparison][]>(
      [
        [operatorMapping.get(KIND_AND), and],
        [operatorMapping.get(KIND_OR), or],
        [operatorMapping.get(KIND_NOR), nor],
        [operatorMapping.get(KIND_XOR), xor],
        [operatorMapping.get(KIND_NOT), not],
        [operatorMapping.get(KIND_EQ), eq],
        [operatorMapping.get(KIND_NE), ne],
        [operatorMapping.get(KIND_GE), ge],
        [operatorMapping.get(KIND_GT), gt],
        [operatorMapping.get(KIND_LE), le],
        [operatorMapping.get(KIND_LT), lt],
        [operatorMapping.get(KIND_IN), In],
        [operatorMapping.get(KIND_NOT_IN), notIn],
        [operatorMapping.get(KIND_OVERLAP), overlap],
        [operatorMapping.get(KIND_PREFIX), prefix],
        [operatorMapping.get(KIND_SUFFIX), suffix],
        [operatorMapping.get(KIND_PRESENT), present],
        [operatorMapping.get(KIND_UNDEF), undef],
      ].filter(([operator]) => !!operator)
    )
  )

export const parser = (options: Options): Parser => ({
  parse: parse({
    operatorExpressionMapping: operatorExpressionMapping(
      options.operatorMapping
    ),
    referenceSerializeOptions: options.serialize.reference,
    escapeCharacter: options.serialize.collection.escapeCharacter,
  }),
})
