import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
export declare const simplifyNotIn: (simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
