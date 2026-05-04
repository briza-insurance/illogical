import {
  OPERATOR_AND,
  OPERATOR_DIVIDE,
  OPERATOR_EQ,
  OPERATOR_GE,
  OPERATOR_GT,
  OPERATOR_IN,
  OPERATOR_LE,
  OPERATOR_LT,
  OPERATOR_MULTIPLY,
  OPERATOR_NE,
  OPERATOR_NOR,
  OPERATOR_NOT,
  OPERATOR_NOT_IN,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
  OPERATOR_PREFIX,
  OPERATOR_PRESENT,
  OPERATOR_SUBTRACT,
  OPERATOR_SUFFIX,
  OPERATOR_SUM,
  OPERATOR_UNDEFINED,
  OPERATOR_XOR,
} from '../operator.js'

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
  referencePredicate: (operand: string) => boolean

  /**
   * A function used to transform the operand into the reference annotation
   * stripped form. I.e. remove any annotation used to detect the
   * reference type.
   * E.g. "$Reference" => "Reference"
   * @param {string} operand
   * @return {string}
   */
  referenceTransform: (operand: string) => string

  /**
   * A function used to transform the stripped form of a reference into an
   * annotated version of the reference. This function should be the inverse
   * function of referenceTranform.
   *
   * referenceSerialization(referenceTransform("$Reference")) === '$Reference'
   *
   * E.g. "Reference" => "$Reference"
   * @param {string} operand
   * @return {string}
   */
  referenceSerialization: (operand: string) => string

  /**
   * Mapping of the operators. The key is unique operator key, and the value
   * is the key used to represent the  given operator in the raw expression.
   */
  operatorMapping: Map<symbol, string>
}

/**
 * Default reference predicate.
 * The "$" symbol at the begging of the operand is used
 * to predicate the reference type.
 * E.g. "$State", "$Country"
 * @param {string} key
 * @return {boolean}
 */
export function defaultReferencePredicate(key: unknown): boolean {
  return typeof key === 'string' && key[0] === '$'
}

/**
 * Default reference transform.
 * It removes the "$" symbol at the begging of the operand name.
 * @param {string} key
 * @return {string}
 */
export function defaultReferenceTransform(key: string): string {
  return key.slice(1)
}

export function defaultReferenceSerialization(key: string): string {
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
  [OPERATOR_NOT, 'NOT'],
  // Arithmetic
  [OPERATOR_SUM, '+'],
  [OPERATOR_SUBTRACT, '-'],
  [OPERATOR_MULTIPLY, '*'],
  [OPERATOR_DIVIDE, '/'],
])

/**
 * Default parser options
 */
export const defaultOptions: Options = {
  referencePredicate: defaultReferencePredicate,
  referenceTransform: defaultReferenceTransform,
  referenceSerialization: defaultReferenceSerialization,
  operatorMapping: defaultOperatorMapping,
}
