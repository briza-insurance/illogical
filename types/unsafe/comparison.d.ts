import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
export declare const simplifyGt: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
export declare const simplifyGe: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
export declare const simplifyLt: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
export declare const simplifyLe: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
