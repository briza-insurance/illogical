/**
 * Parser type definitions.
 * Expressions are compiled directly to bytecode.
 */

// Input types
export type Input =
  | string
  | number
  | boolean
  | null
  | Input[]
  | [string, ...Input[]]
  | Record<string, unknown>
export type ExpressionInput = [string, ...Input[]]
