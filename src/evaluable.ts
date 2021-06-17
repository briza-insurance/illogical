import {
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isUndefined,
} from './common/type-check'
import { CollectionSerializeOptions } from './operand/collection'
import {
  ReferenceSerializeOptions,
  ReferenceSimplifyOptions,
} from './operand/reference'

export type Expression = Evaluated
export type Context = Record<string, unknown>

export type EvaluatedPrimitive = string | number | boolean | null
export type EvaluatedValue = undefined | EvaluatedPrimitive
export type Evaluated = EvaluatedValue | Array<Evaluated>

export const isEvaluable = (value: unknown): value is Evaluable =>
  typeof value === 'object' && !isNullOrUndefined(value) && 'evaluate' in value

export const isEvaluatedPrimitive = (
  value: unknown
): value is EvaluatedPrimitive =>
  isNull(value) || isString(value) || isNumber(value) || isBoolean(value)

export const isEvaluatedValue = (value: unknown): value is EvaluatedValue =>
  isUndefined(value) || isEvaluatedPrimitive(value)

export type OperatorMapping = Map<symbol, string>

export type SimplifyOptions = Partial<{
  reference: ReferenceSimplifyOptions
}>

export type SerializeOptions = Partial<{
  operatorMapping: OperatorMapping
  reference: ReferenceSerializeOptions
  collection: CollectionSerializeOptions
}>

export interface Evaluable {
  kind: symbol
  evaluate(context: Context): Evaluated
  simplify(context: Context, options?: SimplifyOptions): Evaluated | Evaluable
  serialize(options?: SerializeOptions): Expression
  toString(): string
}

export const evaluable = (evaluable: Evaluable): Evaluable => evaluable
