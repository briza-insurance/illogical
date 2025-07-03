import {
  isEvaluable,
  OPERATOR_AND,
  OPERATOR_EQ,
  OPERATOR_IN,
  OPERATOR_NE,
  OPERATOR_NOT,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
} from '..'
import { Context } from '../common/evaluable'
import { isBoolean, isString } from '../common/type-check'
import { Reference } from '../operand/reference'
import { Input } from '../parser'
import { Options } from '../parser/options'

const istrueResult = (value: Input) => value === true

export const unsafeSimplify = (
  context: Context,
  opts: Options,
  strictKeys?: string[],
  optionalKeys?: string[]
) => {
  const simplifyInput = (input: Input): Input | boolean => {
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
          return result.serialize(opts)
        }
        if (isBoolean(result)) {
          return result
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
        const simplifiedOperands: Input = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (isBoolean(simplification) && !istrueResult(simplification)) {
            // Short-circuit for AND
            return false
          }
          simplifiedOperands.push(simplification)
        }

        const simplified = simplifiedOperands.reduce<boolean | Input[]>(
          (result, childResult) => {
            if (result !== false) {
              if (isEvaluable(childResult)) {
                if (isBoolean(result)) {
                  return [childResult]
                }
                return [...result, childResult]
              }
              if (!childResult) {
                return false
              }
            }
            return result
          },
          true
        )

        if (Array.isArray(simplified)) {
          if (simplified.length === 1) {
            return simplified[0]
          }
          return [operator, ...simplified]
        }
        return simplified
      }
      case opts.operatorMapping.get(OPERATOR_OR): {
        const simplifiedOperands: Input = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (isBoolean(simplification) && istrueResult(simplification)) {
            // Short-circuit for OR
            return true
          } else if (simplification) {
            simplifiedOperands.push(simplification)
          }
        }

        const simplified = simplifiedOperands.reduce<boolean | Input[]>(
          (result, childResult) => {
            if (result !== true) {
              if (isEvaluable(childResult)) {
                if (isBoolean(result)) {
                  return [childResult]
                }
                return [...result, childResult]
              }

              if (childResult) {
                return true
              }
            }
            return result
          },
          false
        )
        if (Array.isArray(simplified)) {
          if (simplified.length === 1) {
            return simplified[0]
          }
          return [operator, ...simplified]
        }
        return simplified
      }
      // case opts.operatorMapping.get(OPERATOR_NOR):
      // case opts.operatorMapping.get(OPERATOR_XOR):
      case opts.operatorMapping.get(OPERATOR_NOT): {
        if (operands.length !== 1) {
          throw new Error(
            `Unexpected number of operands for NOT operator: ${operands.length}`
          )
        }
        const simplification = simplifyInput(operands[0])
        return isBoolean(simplification)
          ? !simplification
          : ([operator, simplification] satisfies Input)
      }
      // Comparison operators
      case opts.operatorMapping.get(OPERATOR_EQ): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        if (Array.isArray(left) || Array.isArray(right)) {
          // If either left or right is an array, we cannot simplify further
          return [operator, leftSimplified, rightSimplified]
        }

        // See Equal.comparison
        return left === right
      }
      case opts.operatorMapping.get(OPERATOR_NE): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        if (Array.isArray(left) || Array.isArray(right)) {
          // If either left or right is an array, we cannot simplify further
          return [operator, leftSimplified, rightSimplified]
        }

        // See NotEqual.comparison
        return left !== right
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
          const leftSimplified = left.map(simplifyInput)
          const rightSimplified = simplifyInput(right)
          return leftSimplified.indexOf(rightSimplified) > -1
        }
        if (rightArray) {
          const leftSimplified = simplifyInput(left)
          const rightSimplified = right.map(simplifyInput)
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

        return leftSimplified.some((element) => rightSet.has(element))
      }
      // case opts.operatorMapping.get(OPERATOR_UNDEFINED):
      // case opts.operatorMapping.get(OPERATOR_PRESENT):
      // case opts.operatorMapping.get(OPERATOR_SUM):
      // case opts.operatorMapping.get(OPERATOR_SUBTRACT):
      // case opts.operatorMapping.get(OPERATOR_MULTIPLY):
      // case opts.operatorMapping.get(OPERATOR_DIVIDE):
      default: {
        // TODO remove console
        // console.log(`NO MATCH: ${operator}`)
        return input
      }
    }
  }

  return simplifyInput
}
