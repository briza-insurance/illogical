/**
 * Common module.
 * @module illogical/common
 */

import { Input } from '../parser'
import { Options } from '../parser/options'

/**
 * Valid types for context members
 */
type ContextValue = Record<string, unknown> | string | number | boolean | null | undefined | ContextValue[]

/**
 * Evaluation Context
 * Holds references used during the evaluation process.
 * Format: key: value.
 */
export interface Context {
  [k: string]: ContextValue;
}

/**
 * Evaluation result
 */
export type Result =
  undefined |
  null |
  string |
  number |
  boolean |
  Array<Result>

export enum EvaluableType {
  Operand = 'Operand',
  Expression = 'Expression'
}

/**
 * Evaluable
 */
export interface Evaluable {
  type: EvaluableType;

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate(ctx: Context): Result;

  simplify(ctx: Context, ignoreKeys: string[]): Result | Evaluable

  serialize(options: Options): Input;

  /**
   * Get the strict representation of the evaluable expression.
   */
  toString(): string;
}
