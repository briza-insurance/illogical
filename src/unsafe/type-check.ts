import { Evaluable, Result } from '../common/evaluable'
import {
  isEvaluable,
  isNull,
  isNumber,
  isUndefined,
} from '../common/type-check'
import { Input } from '../parser'

export const isTrueResult = (value: Input) => value === true
export const isFalseResult = (value: Input) => value === false
export const isNonFalseResult = (
  operand: Input | Evaluable
): operand is Input => operand !== false && !isEvaluable(operand)
export const isNonTrueResult = (operand: Input | Evaluable): operand is Input =>
  operand !== true && !isEvaluable(operand)

export const resultToInputInternal = (value: Result): Input | undefined => {
  if (isUndefined(value)) {
    return undefined
  }

  if (Array.isArray(value)) {
    return undefined
  }

  return value
}

export const resultToInput = (value: Result): Input | undefined => {
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

export const areAllNumbers = (results: Input[]): results is number[] => {
  return results.every(isNumber)
}

export const areAllInputs = (
  values: (Input | Evaluable)[]
): values is Input[] => values.every((value) => !isEvaluable(value))

export const getInputValues = (results: Input[]): number[] | false => {
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
