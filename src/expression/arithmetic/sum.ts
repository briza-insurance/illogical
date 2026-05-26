import { Evaluable, Result } from '../../common/evaluable.js'
import { formatDateNumber } from '../../common/util.js'
import { Operand } from '../../operand/index.js'
import { dateArithmeticTypeCheck } from './dateArithmeticTypeCheck.js'
import { Arithmetic } from './index.js'
import { mutateDateWithDuration } from './mutateDateWithDuration.js'
import { operateWithExpectedDecimals } from './operateWithExpectedDecimals.js'

// Operator key
export const OPERATOR = Symbol('SUM')

const addWithExpectedDecimals = operateWithExpectedDecimals('sum')

/**
 * Sum operation expression
 */
export class Sum extends Arithmetic {
  /**
   * @constructor Generic constructor
   * @param {Evaluable[]} args
   */
  constructor(...args: Evaluable[])
  /**
   * @constructor
   * @param {Operand[]} operands Operands.
   */
  constructor(...operands: Operand[]) {
    if (operands.length < 2) {
      throw new Error('sum expression requires at least 2 operands')
    }
    dateArithmeticTypeCheck(...operands)
    super('+', OPERATOR, operands)
  }

  operate(results: Result[]): Result {
    const dateCalculationResults = this.getDateCalculationResults(results)
    if (dateCalculationResults) {
      const [dateNumber, ...durations] = dateCalculationResults
      return formatDateNumber(
        durations.reduce(
          (mutated, duration) =>
            mutateDateWithDuration(mutated, duration, 'sum'),
          dateNumber
        )
      )
    }

    const presentResults = this.getResultValues(results)

    if (presentResults === false) {
      return false
    }

    return presentResults.reduce((acc, result) =>
      addWithExpectedDecimals(acc, result)
    )
  }
}
