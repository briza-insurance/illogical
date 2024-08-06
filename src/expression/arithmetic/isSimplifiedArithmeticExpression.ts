import { Evaluable, Result } from '../../common/evaluable'
import { isEvaluable, isInfinite } from '../../common/type-check'
import { Operand } from '../../operand'
import { Reference } from '../../operand/reference'
import { Arithmetic } from '.'

export const isSimplifiedArithmeticExpression = (
  operand: Operand,
  result: Result | Evaluable
): result is Result =>
  operand instanceof Arithmetic &&
  !isEvaluable(result) &&
  !isInfinite(result) &&
  !(operand instanceof Reference)
