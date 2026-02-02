import { Evaluable, Result } from '../../common/evaluable.js'
import { isEvaluable, isInfinite } from '../../common/type-check.js'
import { Operand } from '../../operand/index.js'
import { Reference } from '../../operand/reference.js'
import { Arithmetic } from './index.js'

export const isSimplifiedArithmeticExpression = (
  operand: Operand,
  result: Result | Evaluable
): result is Result =>
  operand instanceof Arithmetic &&
  !isEvaluable(result) &&
  !isInfinite(result) &&
  !(operand instanceof Reference)
