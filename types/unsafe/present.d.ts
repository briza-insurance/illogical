import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
export declare const simplifyPresent: (simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
export declare const simplifyUndefined: (simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
