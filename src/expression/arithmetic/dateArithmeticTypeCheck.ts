import { isNumber, isReference, isValue } from '../../common/type-check.js'
import { toDateDuration, toDateNumber } from '../../common/util.js'
import { Operand } from '../../operand/index.js'
import { Value } from '../../operand/value.js'

export const dateArithmeticTypeCheck = (...operands: Operand[]) => {
  const [first, ...rest] = operands

  const restAreAllReferences = rest.every((op) => isReference(op))
  const values = rest.filter<Value>((op) => isValue(op))
  const valuesAreAllDurations = values.every(
    (op) => !!toDateDuration(op.evaluate())
  )
  const valuesAreAllNumbers = values.every((op) => isNumber(op.evaluate()))
  if (isReference(first)) {
    if (
      !restAreAllReferences &&
      !valuesAreAllDurations &&
      !valuesAreAllNumbers
    ) {
      throw new Error(
        'sum expression value literals should be all numbers or all date durations'
      )
    }
  } else if (isValue(first)) {
    if (isNumber(first.evaluate())) {
      if (!restAreAllReferences && !valuesAreAllNumbers) {
        throw new Error('sum expression value literals should be all numbers')
      }
    } else {
      if (!isNaN(toDateNumber(first.evaluate()))) {
        if (!restAreAllReferences && !valuesAreAllDurations) {
          throw new Error(
            'sum expression value literals should be all date durations'
          )
        }
      } else {
        throw new Error(
          // eslint-disable-next-line max-len
          'sum expression value literals should be all numbers or starting with an iso date string followed by date durations'
        )
      }
    }
  }
}
