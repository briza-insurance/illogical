import {
  isEvaluable,
  OPERATOR_AND,
  OPERATOR_EQ,
  OPERATOR_IN,
  OPERATOR_NE,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
} from '..'
import { Context, Evaluable, Result } from '../common/evaluable'
import {
  isBoolean,
  isNotObject,
  isString,
  isUndefined,
} from '../common/type-check'
import { Reference } from '../operand/reference'
import { Input } from '../parser'
import { Options } from '../parser/options'

const istrueResult = (value: Input) => value === true
const isNonFalseResult = (operand: Input | Evaluable): operand is Input =>
  operand !== false && !isEvaluable(operand)
const isNonTrueResult = (operand: Input | Evaluable): operand is Input =>
  operand !== true && !isEvaluable(operand)

const resultToInput = (value: Result): Input | undefined => {
  if (isUndefined(value)) {
    return undefined
  }

  if (Array.isArray(value) && value.some(isUndefined)) {
    return undefined
  }

  // TODO Confirm below
  // Having an Object as a Result seems like a previous mistake. Not handling
  // it yet.
  return isNotObject(value) ? (value as Input) : undefined
}

export const unsafeSimplify = (
  context: Context,
  opts: Options,
  strictKeys?: string[],
  optionalKeys?: string[]
) => {
  const simplifyInput = (input: Input): Input | Evaluable => {
    // Value or Reference
    if (!Array.isArray(input)) {
      // Reference
      if (isString(input) && opts.referencePredicate(input)) {
        const result = new Reference(opts.referenceTransform(input)).simplify(
          context,
          strictKeys,
          optionalKeys
        )

        if (isEvaluable(result)) {
          return result
        }

        const inputResult = resultToInput(result)
        if (inputResult !== undefined) {
          return inputResult
        }
        // It should have been a boolean or an Evaluable, but just in case
        // fallback to returning the input.
      }
      // Value
      return input
    }

    const [operator, ...operands] = input

    switch (operator) {
      // Logical operators
      case opts.operatorMapping.get(OPERATOR_AND): {
        const simplifiedOperands: (Input | Evaluable)[] = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (
            isUndefined(simplification) ||
            (isBoolean(simplification) && !istrueResult(simplification))
          ) {
            // Short-circuit for AND
            return false
          }
          simplifiedOperands.push(simplification)
        }

        // Remove false operands leaving only the Inputs
        const simplified = simplifiedOperands.filter(isNonTrueResult)

        if (Array.isArray(simplified)) {
          if (simplified.length === 0) {
            return true
          }
          if (simplified.length === 1) {
            return simplified[0]
          }
          return [operator, ...simplified]
        }
        return simplified
      }
      case opts.operatorMapping.get(OPERATOR_OR): {
        const simplifiedOperands: (Input | Evaluable)[] = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (isBoolean(simplification) && istrueResult(simplification)) {
            // Short-circuit for OR
            return true
          } else if (simplification) {
            simplifiedOperands.push(simplification)
          }
        }

        const simplified = simplifiedOperands.filter(isNonFalseResult)

        if (Array.isArray(simplified)) {
          if (simplified.length === 0) {
            return false
          }
          if (simplified.length === 1) {
            return simplified[0]
          }
          return [operator, ...simplified]
        }

        return simplified
      }
      // case opts.operatorMapping.get(OPERATOR_NOR):
      // case opts.operatorMapping.get(OPERATOR_XOR):
      // case opts.operatorMapping.get(OPERATOR_NOT): {
      //   if (operands.length !== 1) {
      //     throw new Error(
      //       `Unexpected number of operands for NOT operator: ${operands.length}`
      //     )
      //   }
      //   const simplification = simplifyInput(operands[0])
      //   return isBoolean(simplification)
      //     ? !simplification
      //     : ([operator, simplification] satisfies Input)
      // }
      // Comparison operators
      case opts.operatorMapping.get(OPERATOR_EQ): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        if (isEvaluable(leftSimplified) || isEvaluable(rightSimplified)) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isEvaluable(leftSimplified) ? leftSimplified.serialize(opts) : left,
            isEvaluable(rightSimplified)
              ? rightSimplified.serialize(opts)
              : right,
          ]
        }

        // See Equal.comparison
        return leftSimplified === rightSimplified
      }
      case opts.operatorMapping.get(OPERATOR_NE): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        if (Array.isArray(left) || Array.isArray(right)) {
          // If either left or right is an array, we cannot simplify further
          return [operator, left, right]
        }

        // See NotEqual.comparison
        return leftSimplified !== rightSimplified
      }
      // case opts.operatorMapping.get(OPERATOR_GT):
      // case opts.operatorMapping.get(OPERATOR_GE):
      // case opts.operatorMapping.get(OPERATOR_LT):
      // case opts.operatorMapping.get(OPERATOR_LE):
      case opts.operatorMapping.get(OPERATOR_IN): {
        const [left, right] = operands

        const leftArray = Array.isArray(left)
        const rightArray = Array.isArray(right)

        if (
          left === null ||
          left === undefined ||
          right === null ||
          right === undefined ||
          (leftArray && rightArray) ||
          (!leftArray && !rightArray)
        ) {
          return input
        }

        if (leftArray) {
          // If any operand is still an Evaluable, we cannot simplify further
          const rightSimplified = simplifyInput(right)
          if (isEvaluable(rightSimplified)) {
            return input
          }
          const leftSimplified = left.map(simplifyInput)
          if (leftSimplified.some(isEvaluable)) {
            return input
          }
          return leftSimplified.indexOf(rightSimplified) > -1
        }

        if (rightArray) {
          const leftSimplified = simplifyInput(left)
          if (isEvaluable(leftSimplified)) {
            return input
          }
          const rightSimplified = right.map(simplifyInput)
          if (rightSimplified.some(isEvaluable)) {
            return input
          }
          return rightSimplified.indexOf(leftSimplified) > -1
        }

        return input
      }
      // case opts.operatorMapping.get(OPERATOR_NOT_IN):
      // case opts.operatorMapping.get(OPERATOR_PREFIX):
      // case opts.operatorMapping.get(OPERATOR_SUFFIX):
      case opts.operatorMapping.get(OPERATOR_OVERLAP): {
        const [left, right] = operands

        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        if (!Array.isArray(leftSimplified) || !Array.isArray(rightSimplified)) {
          return input
        }

        const rightSet = new Set(rightSimplified)

        const res = leftSimplified.some((element) => rightSet.has(element))

        if (res) {
          return true
        }

        if (
          leftSimplified.some(isEvaluable) ||
          rightSimplified.some(isEvaluable)
        ) {
          return input
        }

        return false
      }
      // case opts.operatorMapping.get(OPERATOR_UNDEFINED):
      // case opts.operatorMapping.get(OPERATOR_PRESENT):
      // case opts.operatorMapping.get(OPERATOR_SUM):
      // case opts.operatorMapping.get(OPERATOR_SUBTRACT):
      // case opts.operatorMapping.get(OPERATOR_MULTIPLY):
      // case opts.operatorMapping.get(OPERATOR_DIVIDE):
      default: {
        // Handle as an array of References / Values if no operator matches
        const result = input.map(simplifyInput)
        // TODO Fix return type to handle mixed (Input | Evaluable)[]
        return result as Input[]
      }
    }
  }

  return simplifyInput
}
