/**
 * Bytecode simplify interpreter.
 *
 * Runs the same bytecode as the evaluate interpreter but supports partial
 * evaluation. Stack slots hold either a Result (fully resolved) or an Input
 * fragment (residual — a ref string or a sub-expression array). When an
 * operator receives any residual operand it reconstructs the sub-expression
 * as an Input array instead of computing a value.
 *
 * Short-circuit logic still applies: AND with a false short-circuits even if
 * other operands are unknown; OR with a true short-circuits likewise.
 */
import { Context } from '../common/evaluable.js';
import { Input } from '../parser/index.js';
import { CompiledExpression } from './compiler.js';
export declare function interpretSimplify(compiled: CompiledExpression, ctx: Context, strictKeys?: string[] | Set<string>, optionalKeys?: string[] | Set<string>): Input;
