import { isBoolean } from '../../common/type-check/'
import { Evaluable, isEvaluable } from '../../evaluable'
import { Logical, logical } from './logical'

export const KIND = Symbol('not')

export const not = (operand: Evaluable): Logical =>
  logical({
    kind: KIND,
    operator: 'NOT',
    operands: [operand],
    evaluate: (context) => {
      const result = operand.evaluate(context)
      if (!isBoolean(result)) {
        throw new Error(
          "logical NOT expression's operand must be evaluated to boolean value"
        )
      }
      return !result
    },
    simplify: (context, options) => {
      const simplified = operand.simplify(context, options)
      if (isBoolean(simplified)) {
        return !simplified
      }
      if (isEvaluable(simplified)) {
        return not(simplified)
      }
      throw new Error(
        "logical NOT expression's operand must be simplify to boolean or evaluable value"
      )
    },
    toString: function () {
      return `(${this.operator} ${operand.toString()})`
    },
  })
