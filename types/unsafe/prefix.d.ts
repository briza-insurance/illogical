import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
export declare const simplifyPrefix: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
export declare const simplifySuffix: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
