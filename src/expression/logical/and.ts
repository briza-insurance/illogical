import { isBoolean } from '../../common/type-check/'
import { Evaluable } from '../../evaluable'
import { Logical, logical } from './logical'

export const KIND = Symbol('and')

export const and = (...operands: Evaluable[]): Logical => {
  if (operands.length < 2) {
    throw new Error('logical AND expression must have at least 2 operands')
  }

  return logical({
    kind: KIND,
    operator: 'AND',
    operands,
    evaluate: (context) =>
      !operands.some((operand) => operand.evaluate(context) === false),
    simplify: (context, options) => {
      let simplified: boolean | Evaluable[] = true
      for (const operand of operands) {
        const result = operand.simplify(context, options)
        if (isBoolean(result)) {
          if (!result) {
            return false
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
      return simplified.length === 1 ? simplified[0] : and(...simplified)
    },
  })
}
