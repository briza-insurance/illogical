/**
 * Operator symbols shared between bytecode compiler and other modules.
 * These symbols uniquely identify each operator across the codebase.
 */

// Comparison operators
export const OPERATOR_EQ = Symbol('==')
export const OPERATOR_NE = Symbol('!=')
export const OPERATOR_GT = Symbol('>')
export const OPERATOR_GE = Symbol('>=')
export const OPERATOR_LT = Symbol('<')
export const OPERATOR_LE = Symbol('<=')

// Containment operators
export const OPERATOR_IN = Symbol('IN')
export const OPERATOR_NOT_IN = Symbol('NOT IN')

// String operators
export const OPERATOR_PREFIX = Symbol('PREFIX')
export const OPERATOR_SUFFIX = Symbol('SUFFIX')

// Array operator
export const OPERATOR_OVERLAP = Symbol('OVERLAP')

// Presence operators
export const OPERATOR_UNDEFINED = Symbol('UNDEFINED')
export const OPERATOR_PRESENT = Symbol('PRESENT')

// Logical operators
export const OPERATOR_AND = Symbol('AND')
export const OPERATOR_OR = Symbol('OR')
export const OPERATOR_NOR = Symbol('NOR')
export const OPERATOR_XOR = Symbol('XOR')
export const OPERATOR_NOT = Symbol('NOT')

// Arithmetic operators
export const OPERATOR_SUM = Symbol('+')
export const OPERATOR_SUBTRACT = Symbol('-')
export const OPERATOR_MULTIPLY = Symbol('*')
export const OPERATOR_DIVIDE = Symbol('/')
