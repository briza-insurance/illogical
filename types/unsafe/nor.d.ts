import { Evaluable } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
export declare const simplifyNor: (opts: Options, simplifyInput: (input: Input) => Input | Evaluable) => (input: Input[] | [string, ...Input[]]) => Input | Evaluable;
