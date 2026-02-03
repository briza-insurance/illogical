import { Evaluable, Result } from '../../common/evaluable.js';
import { Operand } from '../../operand/index.js';
export declare const isSimplifiedArithmeticExpression: (operand: Operand, result: Result | Evaluable) => result is Result;
