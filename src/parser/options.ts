/**
 * Parser module.
 * @module illogical/parser
 */

import { isString } from '../common/type-check'

// Comparison expressions
import { OPERATOR as OPERATOR_EQ } from '../expression/comparison/eq'
import { OPERATOR as OPERATOR_NE } from '../expression/comparison/ne'
import { OPERATOR as OPERATOR_GT } from '../expression/comparison/gt'
import { OPERATOR as OPERATOR_GE } from '../expression/comparison/ge'
import { OPERATOR as OPERATOR_LT } from '../expression/comparison/lt'
import { OPERATOR as OPERATOR_LE } from '../expression/comparison/le'
import { OPERATOR as OPERATOR_IN } from '../expression/comparison/in'
import { OPERATOR as OPERATOR_NOT_IN } from '../expression/comparison/not-in'

// Logical expressions
import { OPERATOR as OPERATOR_AND } from '../expression/logical/and'
import { OPERATOR as OPERATOR_OR } from '../expression/logical/or'
import { OPERATOR as OPERATOR_NOR } from '../expression/logical/nor'
import { OPERATOR as OPERATOR_XOR } from '../expression/logical/xor'

// Option value whitelist
export type optionValue = ((operand: string) => string | boolean) | Map<symbol, string>

// Parser options
export interface Options {
  /**
   * A function used to determine if the operand is a reference type,
   * otherwise evaluated as a static value.
   * @param {string} operand
   * @return {boolean}
   * * True = reference
   * * False = value
   */
  referencePredicate: (operand: string) => boolean;

  /**
   * A function used to transform the operand into the reference annotation
   * stripped form. I.e. remove any annotation used to detect the
   * reference type.
   * E.g. "$Reference" => "Reference"
   * @param {string} operand
   * @return {string}
   */
  referenceTransform: (operand: string) => string;

  /**
   * Mapping of the operators. The key is unique operator key, and the value
   * is the key used to represent the  given operator in the raw expression.
   */
  operatorMapping: Map<symbol, string>;

  // Object key accessor whitelisting
  [k: string]: optionValue;
}

/**
 * Default reference predicate.
 * The "$" symbol at the begging of the operand is used
 * to predicate the reference type.
 * E.g. "$State", "$Country"
 * @param {string} key
 * @return {boolean}
 */
export function defaultReferencePredicate (key: string): boolean {
  return isString(key) && (key as string).startsWith('$')
}

/**
 * Default reference transform.
 * It removes the "$" symbol at the begging of the operand name.
 * @param {string} key
 * @return {string}
 */
export function defaultReferenceTransform (key: string): string {
  return key.slice(1)
}

// Default operator mapping
// Unique operator key <-> raw expression key
export const defaultOperatorMapping = new Map<symbol, string>([
  // Comparison
  [OPERATOR_EQ, '=='],
  [OPERATOR_NE, '!='],
  [OPERATOR_GT, '>'],
  [OPERATOR_GE, '>='],
  [OPERATOR_LT, '<'],
  [OPERATOR_LE, '<='],
  [OPERATOR_IN, 'IN'],
  [OPERATOR_NOT_IN, 'NOT IN'],
  // Logical
  [OPERATOR_AND, 'AND'],
  [OPERATOR_OR, 'OR'],
  [OPERATOR_NOR, 'NOR'],
  [OPERATOR_XOR, 'XOR']
])

/**
 * Default parser options
 */
export const defaultOptions: Options = {
  referencePredicate: defaultReferencePredicate,
  referenceTransform: defaultReferenceTransform,
  operatorMapping: defaultOperatorMapping
}