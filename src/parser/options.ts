/**
 * Parser module.
 * @module illogical/parser
 */

import { isString } from '../common/type-check'
import { OPERATOR as OPERATOR_EQ } from '../expression/comparison/eq'
import { OPERATOR as OPERATOR_GE } from '../expression/comparison/ge'
import { OPERATOR as OPERATOR_GT } from '../expression/comparison/gt'
import { OPERATOR as OPERATOR_IN } from '../expression/comparison/in'
import { OPERATOR as OPERATOR_LE } from '../expression/comparison/le'
import { OPERATOR as OPERATOR_LT } from '../expression/comparison/lt'
import { OPERATOR as OPERATOR_NE } from '../expression/comparison/ne'
import { OPERATOR as OPERATOR_NOT_IN } from '../expression/comparison/not-in'
import { OPERATOR as OPERATOR_OVERLAP } from '../expression/comparison/overlap'
import { OPERATOR as OPERATOR_PREFIX } from '../expression/comparison/prefix'
import { OPERATOR as OPERATOR_PRESENT } from '../expression/comparison/present'
import { OPERATOR as OPERATOR_SUFFIX } from '../expression/comparison/suffix'
import { OPERATOR as OPERATOR_UNDEFINED } from '../expression/comparison/undefined'
import { OPERATOR as OPERATOR_AND } from '../expression/logical/and'
import { OPERATOR as OPERATOR_NOR } from '../expression/logical/nor'
import { OPERATOR as OPERATOR_NOT } from '../expression/logical/not'
import { OPERATOR as OPERATOR_OR } from '../expression/logical/or'
import { OPERATOR as OPERATOR_XOR } from '../expression/logical/xor'

// Option value whitelist
export type optionValue =
  | ((operand: string) => string | boolean)
  | Map<symbol, string>
  | boolean;

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
   * A function used to tranform ths stripped form of a reference into an
   * annoteted version of the reference. This function should be the inverse
   * function of referenceTranform.
   *
   * referenceSerialization(referenceTransform("$Reference")) === '$Reference'
   *
   * E.g. "Reference" => "$Reference"
   * @param {string} operand
   * @return {string}
   */
  referenceSerialization: (operand: string) => string;

  /**
   * Mapping of the operators. The key is unique operator key, and the value
   * is the key used to represent the  given operator in the raw expression.
   */
  operatorMapping: Map<symbol, string>;

  /**
   * Configures strict data type check in comparison expressions
   * Default set to true which ensures that type coercion is NOT allowed
   */
  strictTypeComparison: boolean;

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

export function defaultReferenceSerialization (key: string): string {
  return `$${key}`
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
  [OPERATOR_PREFIX, 'PREFIX'],
  [OPERATOR_SUFFIX, 'SUFFIX'],
  [OPERATOR_OVERLAP, 'OVERLAP'],
  [OPERATOR_UNDEFINED, 'UNDEFINED'],
  [OPERATOR_PRESENT, 'PRESENT'],
  // Logical
  [OPERATOR_AND, 'AND'],
  [OPERATOR_OR, 'OR'],
  [OPERATOR_NOR, 'NOR'],
  [OPERATOR_XOR, 'XOR'],
  [OPERATOR_NOT, 'NOT']
])

/**
 * Default parser options
 */
export const defaultOptions: Options = {
  referencePredicate: defaultReferencePredicate,
  referenceTransform: defaultReferenceTransform,
  referenceSerialization: defaultReferenceSerialization,
  operatorMapping: defaultOperatorMapping,
  strictTypeComparison: true
}
