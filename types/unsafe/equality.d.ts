import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
export declare const simplifyEq: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
export declare const simplifyNe: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
