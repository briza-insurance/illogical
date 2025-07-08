import {
  isEvaluable,
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
} from '..'
import { Context, Evaluable, Result } from '../common/evaluable'
import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from '../common/type-check'
import { toDateNumber } from '../common/util'
import { operateWithExpectedDecimals } from '../expression/arithmetic/operateWithExpectedDecimals'
import { Collection } from '../operand/collection'
import { Reference } from '../operand/reference'
import { Value } from '../operand/value'
import { Input } from '../parser'
import { Options } from '../parser/options'

const isTrueResult = (value: Input) => value === true
const isFalseResult = (value: Input) => value === false
const isNonFalseResult = (operand: Input | Evaluable): operand is Input =>
  operand !== false && !isEvaluable(operand)
const isNonTrueResult = (operand: Input | Evaluable): operand is Input =>
  operand !== true && !isEvaluable(operand)

const resultToInputInternal = (value: Result): Input | undefined => {
  if (isUndefined(value)) {
    return undefined
  }

  if (Array.isArray(value)) {
    return undefined
  }

  return value
}

const resultToInput = (value: Result): Input | undefined => {
  if (isUndefined(value)) {
    return undefined
  }

  if (Array.isArray(value)) {
    const definedValues = value
      .map(resultToInputInternal)
      .filter((val) => !isUndefined(val))

    if (definedValues.length === 0) {
      return undefined
    }

    return definedValues
  }

  return value
}

const areAllNumbers = (results: Input[]): results is number[] => {
  return results.every(isNumber)
}

const areAllInputs = (values: (Input | Evaluable)[]): values is Input[] =>
  values.every((value) => !isEvaluable(value))

const getInputValues = (results: Input[]): number[] | false => {
  const presentValues = results.filter(
    (result) => !isNull(result) && !isUndefined(result)
  )
  // If we have missing context values the result or we still have refences
  // simplify to false.
  if (
    presentValues.length !== results.length ||
    !areAllNumbers(presentValues)
  ) {
    return false
  }

  return presentValues
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
        if (!isUndefined(inputResult)) {
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

        if (simplified.length === 0) {
          return true
        }
        if (simplified.length === 1) {
          return simplified[0]
        }
        return [operator, ...simplified]
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

        if (simplified.length === 0) {
          return false
        }
        if (simplified.length === 1) {
          return simplified[0]
        }
        return [operator, ...simplified]
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

        if (simplified.length === 0) {
          return true
        }
        if (simplified.length === 1) {
          return ['NOT', simplified[0]]
        }
        return [operator, ...simplified]
      }
      case opts.operatorMapping.get(OPERATOR_XOR): {
        let trueCount = 0
        const simplifiedOperands: Input[] = []
        for (const operand of operands) {
          const simplification = simplifyInput(operand)
          if (isBoolean(simplification) && isTrueResult(simplification)) {
            trueCount++
            continue
          }
          if (isBoolean(simplification) && isFalseResult(simplification)) {
            continue
          }
          if (!isEvaluable(simplification)) {
            simplifiedOperands.push(simplification)
          }
        }

        if (trueCount > 1) {
          return false
        }

        if (simplifiedOperands.length === 0) {
          return trueCount === 1
        }

        if (simplifiedOperands.length === 1) {
          if (trueCount === 1) {
            return ['NOT', simplifiedOperands[0]]
          }
          return simplifiedOperands[0]
        }
        if (trueCount === 1) {
          return ['NOR', ...simplifiedOperands]
        }
        return ['XOR', ...simplifiedOperands]
      }
      case opts.operatorMapping.get(OPERATOR_NOT): {
        const simplification = simplifyInput(operands[0])

        if (isBoolean(simplification)) {
          return !simplification
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

        const leftDate = toDateNumber(leftSimplified),
          rightDate = toDateNumber(rightSimplified)
        if (leftDate && rightDate) {
          return leftDate > rightDate
        }

        if (Array.isArray(leftSimplified) || Array.isArray(rightSimplified)) {
          return [operator, leftSimplified, rightSimplified]
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

        const leftDate = toDateNumber(leftSimplified),
          rightDate = toDateNumber(rightSimplified)
        if (leftDate && rightDate) {
          return leftDate >= rightDate
        }

        if (Array.isArray(leftSimplified) || Array.isArray(rightSimplified)) {
          return [operator, leftSimplified, rightSimplified]
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

        const leftDate = toDateNumber(leftSimplified),
          rightDate = toDateNumber(rightSimplified)
        if (leftDate && rightDate) {
          return leftDate < rightDate
        }

        if (Array.isArray(leftSimplified) || Array.isArray(rightSimplified)) {
          return [operator, leftSimplified, rightSimplified]
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

        const leftDate = toDateNumber(leftSimplified),
          rightDate = toDateNumber(rightSimplified)
        if (leftDate && rightDate) {
          return leftDate <= rightDate
        }

        if (Array.isArray(leftSimplified) || Array.isArray(rightSimplified)) {
          return [operator, leftSimplified, rightSimplified]
        }

        return false
      }
      case opts.operatorMapping.get(OPERATOR_IN): {
        const [left, right] = operands

        const leftArray = Array.isArray(left)
        const rightArray = Array.isArray(right)

        if (
          isNull(left) ||
          isUndefined(left) ||
          isNull(right) ||
          isUndefined(right)
        ) {
          return false
        }
        const leftSimplified = simplifyInput(left)
        const rightSimplified = simplifyInput(right)

        // If left is an array, right side could be a reference containing a
        // single value or a value directly.
        if (leftArray) {
          const rightSimplified = simplifyInput(right)
          // If any operand is still an Evaluable, we cannot simplify further
          if (isEvaluable(rightSimplified)) {
            return input
          }
          const leftSimplified = left.map(simplifyInput)
          if (leftSimplified.some(isEvaluable)) {
            return input
          }
          return leftSimplified.indexOf(rightSimplified) > -1
        }

        // If right is an array, left side could be a reference containing a
        // single value or a value directly.
        if (rightArray) {
          const leftSimplified = simplifyInput(left)
          // If any operand is still an Evaluable, we cannot simplify further
          if (isEvaluable(leftSimplified)) {
            return input
          }
          const rightSimplified = right.map(simplifyInput)
          if (rightSimplified.some(isEvaluable)) {
            return input
          }
          return rightSimplified.indexOf(leftSimplified) > -1
        }

        // If none of them are arrays it means one of them must be a reference
        // containing a list of values.
        if (Array.isArray(leftSimplified)) {
          if (isEvaluable(rightSimplified)) {
            return input
          }
          return leftSimplified.indexOf(rightSimplified) > -1
        }
        if (Array.isArray(rightSimplified)) {
          if (isEvaluable(leftSimplified)) {
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
          isNull(left) ||
          isUndefined(left) ||
          isNull(right) ||
          isUndefined(right) ||
          (leftArray && rightArray) ||
          (!leftArray && !rightArray)
        ) {
          return true
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

        const isLeftEvaluable = isEvaluable(leftSimplified)
        const isRightEvaluable = isEvaluable(rightSimplified)

        if (isLeftEvaluable || isRightEvaluable) {
          // If either left or right is an array, we cannot simplify further
          return input
        }

        // If simplified results are not arrays, it means we had a strictKey
        // without values provided. Simplify to false.
        if (!Array.isArray(leftSimplified) || !Array.isArray(rightSimplified)) {
          return false
        }

        const rightSet = new Set(rightSimplified)

        const res = leftSimplified.some((element) => rightSet.has(element))

        if (res) {
          return true
        }

        return false
      }
      case opts.operatorMapping.get(OPERATOR_UNDEFINED): {
        const [operand] = operands
        const simplified = simplifyInput(operand)

        const isOperandEvaluable = isEvaluable(simplified)
        if (isOperandEvaluable) {
          return input
        }

        // Operand simplifies to itself when it is included in strictKeys or
        // optionalKeys, thus it was undefined.
        if (operand === simplified) {
          return true
        }

        return isUndefined(simplified)
      }
      case opts.operatorMapping.get(OPERATOR_PRESENT): {
        const [operand] = operands
        const simplified = simplifyInput(operand)

        const isOperandEvaluable = isEvaluable(simplified)
        if (isOperandEvaluable) {
          return input
        }

        // Operand simplifies to itself when it is included in strictKeys or
        // optionalKeys, thus it was undefined.
        if (operand === simplified) {
          return false
        }

        return !isUndefined(simplified) && !isNull(simplified)
      }
      // Arithmetic operators
      case opts.operatorMapping.get(OPERATOR_SUM): {
        const results = operands.map(simplifyInput)
        if (areAllInputs(results)) {
          const presentValues = getInputValues(results)

          if (isFalseResult(presentValues)) {
            return false
          }

          return presentValues.reduce((acc, result) =>
            operateWithExpectedDecimals('sum')(acc, result)
          )
        }

        return input
      }
      case opts.operatorMapping.get(OPERATOR_SUBTRACT): {
        const results = operands.map(simplifyInput)
        if (areAllInputs(results)) {
          const presentValues = getInputValues(results)

          if (isFalseResult(presentValues)) {
            return false
          }

          return presentValues.reduce((acc, result) =>
            operateWithExpectedDecimals('subtract')(acc, result)
          )
        }

        return input
      }
      case opts.operatorMapping.get(OPERATOR_MULTIPLY): {
        const results = operands.map(simplifyInput)
        if (areAllInputs(results)) {
          const presentValues = getInputValues(results)

          if (isFalseResult(presentValues)) {
            return false
          }

          return presentValues.reduce((acc, result) =>
            operateWithExpectedDecimals('multiply')(acc, result)
          )
        }

        return input
      }
      case opts.operatorMapping.get(OPERATOR_DIVIDE): {
        const results = operands.map(simplifyInput)
        if (areAllInputs(results)) {
          const presentValues = getInputValues(results)

          if (isFalseResult(presentValues)) {
            return false
          }

          return presentValues.reduce((acc, result) => acc / result)
        }

        return input
      }
      default: {
        // Handle as an array of References / Values if no operator matches
        const result = input.map(simplifyInput)

        if (!areAllInputs(result)) {
          return new Collection(
            result.map((item) => {
              if (item instanceof Reference) {
                return item
              }
              if (!isEvaluable(item)) {
                return new Value(item)
              }
              throw new Error(
                'Unexpected expression found within a collection of values/references'
              )
            })
          )
        }

        return result
      }
    }
  }

  return simplifyInput
}
