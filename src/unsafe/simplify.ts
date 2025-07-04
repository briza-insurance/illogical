import {
  isEvaluable,
  OPERATOR_AND,
  OPERATOR_EQ,
  OPERATOR_GE,
  OPERATOR_GT,
  OPERATOR_IN,
  OPERATOR_LE,
  OPERATOR_LT,
  OPERATOR_NE,
  OPERATOR_NOR,
  OPERATOR_NOT,
  OPERATOR_NOT_IN,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
  OPERATOR_PREFIX,
  OPERATOR_SUFFIX,
  OPERATOR_XOR,
} from '..'
import { Context, Evaluable, Result } from '../common/evaluable'
import {
  isBoolean,
  isNotObject,
  isNumber,
  isString,
  isUndefined,
} from '../common/type-check'
import { toDateNumber } from '../common/util'
import { Reference } from '../operand/reference'
import { Input } from '../parser'
import { Options } from '../parser/options'

const isTrueResult = (value: Input) => value === true
const isFalseResult = (value: Input) => value === false
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
            (isBoolean(simplification) && !isTrueResult(simplification))
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
          if (isBoolean(simplification) && isTrueResult(simplification)) {
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
      case opts.operatorMapping.get(OPERATOR_NOR): {
        const simplifiedOperands: (Input | Evaluable)[] = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (
            isUndefined(simplification) ||
            (isBoolean(simplification) && isTrueResult(simplification))
          ) {
            // Short-circuit for AND
            return false
          }
          simplifiedOperands.push(simplification)
        }

        // Remove true operands leaving only the Inputs
        const simplified = simplifiedOperands.filter(isNonFalseResult)

        if (Array.isArray(simplified)) {
          if (simplified.length === 0) {
            return true
          }
          if (simplified.length === 1) {
            return ['NOT', simplified[0]]
          }
          return [operator, ...simplified]
        }

        return simplified
      }
      case opts.operatorMapping.get(OPERATOR_XOR): {
        let trueCount = 0
        const simplifiedOperands: (Input | Evaluable)[] = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (isBoolean(simplification) && isTrueResult(simplification)) {
            trueCount++
            continue
          }
          if (isBoolean(simplification) && isFalseResult(simplification)) {
            continue
          }
          simplifiedOperands.push(simplification)
        }

        if (trueCount > 1) {
          return false
        }

        if (simplifiedOperands.length === 0) {
          return trueCount === 1
        }

        const simplifiedInputs = simplifiedOperands.map((op) =>
          isEvaluable(op) ? op.serialize(opts) : op
        )

        if (simplifiedOperands.length === 1) {
          if (trueCount === 1) {
            return ['NOT', simplifiedInputs[0]]
          }
          return simplifiedOperands[0]
        }
        if (trueCount === 1) {
          return ['NOR', ...simplifiedInputs]
        }
        return ['XOR', ...simplifiedInputs]
      }
      case opts.operatorMapping.get(OPERATOR_NOT): {
        if (operands.length !== 1) {
          throw new Error(
            `Unexpected number of operands for NOT operator: ${operands.length}`
          )
        }
        const simplification = simplifyInput(operands[0])

        if (isBoolean(simplification)) {
          return !simplification
        }

        if (!isEvaluable(simplification)) {
          return [operator, simplification] satisfies Input
        }

        return input
      }
      // Comparison operators
      case opts.operatorMapping.get(OPERATOR_EQ): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        // See Equal.comparison
        return leftSimplified === rightSimplified
      }
      case opts.operatorMapping.get(OPERATOR_NE): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        // See NotEqual.comparison
        return leftSimplified !== rightSimplified
      }
      case opts.operatorMapping.get(OPERATOR_GT): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        if (isNumber(leftSimplified) && isNumber(rightSimplified)) {
          return leftSimplified > rightSimplified
        }

        const leftDate = toDateNumber(left),
          rightDate = toDateNumber(right)
        if (leftDate && rightDate) {
          return leftDate > rightDate
        }

        return false
      }
      case opts.operatorMapping.get(OPERATOR_GE): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        if (isNumber(leftSimplified) && isNumber(rightSimplified)) {
          return leftSimplified >= rightSimplified
        }

        const leftDate = toDateNumber(left),
          rightDate = toDateNumber(right)
        if (leftDate && rightDate) {
          return leftDate >= rightDate
        }

        return false
      }
      case opts.operatorMapping.get(OPERATOR_LT): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        if (isNumber(leftSimplified) && isNumber(rightSimplified)) {
          return leftSimplified < rightSimplified
        }

        const leftDate = toDateNumber(left),
          rightDate = toDateNumber(right)
        if (leftDate && rightDate) {
          return leftDate < rightDate
        }

        return false
      }
      case opts.operatorMapping.get(OPERATOR_LE): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        if (isNumber(leftSimplified) && isNumber(rightSimplified)) {
          return leftSimplified <= rightSimplified
        }

        const leftDate = toDateNumber(left),
          rightDate = toDateNumber(right)
        if (leftDate && rightDate) {
          return leftDate <= rightDate
        }

        return false
      }
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
      case opts.operatorMapping.get(OPERATOR_NOT_IN): {
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
          return leftSimplified.indexOf(rightSimplified) === -1
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
          return rightSimplified.indexOf(leftSimplified) === -1
        }

        return input
      }
      case opts.operatorMapping.get(OPERATOR_PREFIX): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        if (isString(leftSimplified) && isString(rightSimplified)) {
          return rightSimplified.startsWith(leftSimplified)
        }

        return false
      }
      case opts.operatorMapping.get(OPERATOR_SUFFIX): {
        const [left, right] = operands
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return [
            operator,
            isLeftEvaluable ? leftSimplified.serialize(opts) : left,
            isRightEvaluable ? rightSimplified.serialize(opts) : right,
          ]
        }

        if (isString(leftSimplified) && isString(rightSimplified)) {
          return leftSimplified.endsWith(rightSimplified)
        }

        return false
      }
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
