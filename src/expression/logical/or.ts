import { isBoolean } from '../../common/type-check/'
import { Evaluable } from '../../evaluable'
import { Logical, logical } from './logical'

export const KIND = Symbol('or')

export const or = (...operands: Evaluable[]): Logical => {
  if (operands.length < 2) {
    throw new Error('logical OR expression must have at least 2 operands')
  }

  return logical({
    kind: KIND,
    operator: 'OR',
    operands,
    evaluate: (context) =>
      operands.some((operand) => operand.evaluate(context) === true),
    simplify: (context, options) => {
      let simplified: boolean | Evaluable[] = false
      for (const operand of operands) {
        const result = operand.simplify(context, options)
        if (isBoolean(result)) {
          if (result) {
            return true
          }
          continue
        }

        simplified = isBoolean(simplified)
          ? [operand]
          : [...simplified, operand]
      }

      if (isBoolean(simplified)) {
        return simplified
      }
      return simplified.length === 1 ? simplified[0] : or(...simplified)
    },
  })
}
