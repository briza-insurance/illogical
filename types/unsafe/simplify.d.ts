import { Context, Evaluable } from '../common/evaluable';
import { Input } from '../parser';
import { Options } from '../parser/options';
export declare const unsafeSimplify: (context: Context, opts: Options, strictKeys?: string[], optionalKeys?: string[]) => (input: Input) => Input | Evaluable;
