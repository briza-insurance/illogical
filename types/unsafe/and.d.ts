import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
export declare const simplifyAnd: (simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
