import { isBoolean } from '../../common/type-check/'
import { Evaluable } from '../../evaluable'
import { Logical, logical } from './logical'
import { nor } from './nor'
import { not } from './not'

export const KIND = Symbol('XOR')

const xorOp = (a: boolean, b: boolean): boolean => (a || b) && !(a && b)

export const xor = (...operands: Evaluable[]): Logical => {
  if (operands.length < 2) {
    throw new Error('logical XOR expression must have at least 2 operands')
  }

  return logical({
    kind: KIND,
    operator: 'XOR',
    operands,
    evaluate: (context) =>
      operands
        .slice(1)
        .reduce(
          (result, operand) =>
            xorOp(result, operand.evaluate(context) === true),
          operands[0].evaluate(context) === true
        ),
    simplify: (context, options) => {
      let truthy = 0
      let evaluable: Evaluable[] = []
      for (const operand of operands) {
        const result = operand.simplify(context, options)
        if (isBoolean(result)) {
          if (result) {
            truthy++
          }
          if (truthy > 1) {
            return false
          }
          continue
        }

        evaluable = [...evaluable, operand]
      }

      if (!evaluable.length) {
        return truthy === 1
      }
      if (evaluable.length === 1) {
        if (truthy === 1) {
          return not(evaluable[0])
        }
        return evaluable[0]
      }
      if (truthy === 1) {
        return nor(...evaluable)
      }
      return xor(...evaluable)
    },
  })
}
