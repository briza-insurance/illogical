import { Evaluable, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
export declare const isSimplifiedArithmeticExpression: (operand: Operand, result: Result | Evaluable) => result is Result;
