import { Evaluable } from '../common/evaluable'
import { operateWithExpectedDecimals } from '../expression/arithmetic/operateWithExpectedDecimals'
import { Input } from '../parser'
import { areAllInputs, getInputValues, isFalseResult } from './type-check'

const simplify =
  (
    simplifyInput: (input: Input) => Input | Evaluable,
    predicate: (first: number, second: number) => number
  ) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable => {
    const [, ...operands] = input

    const results = operands.map(simplifyInput)
    if (areAllInputs(results)) {
      const presentValues = getInputValues(results)

      if (isFalseResult(presentValues)) {
        return false
      }

      return presentValues.reduce(predicate)
    }

    return input
  }

export const simplifySum =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(simplifyInput, operateWithExpectedDecimals('sum'))(input)

export const simplifySubtract =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(simplifyInput, operateWithExpectedDecimals('subtract'))(input)

export const simplifyMultiply =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(simplifyInput, operateWithExpectedDecimals('multiply'))(input)

export const simplifyDivide =
  (simplifyInput: (input: Input) => Input | Evaluable) =>
  (input: Input[] | [string, ...Input[]]): Input | Evaluable =>
    simplify(
      simplifyInput,
      (acc: number, result: number) => acc / result
    )(input)
