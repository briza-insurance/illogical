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
import { Context, Result } from '../common/evaluable.js';
import { Input } from '../parser/index.js';
import { CompiledExpression } from './compiler.js';
interface DivByZeroMarker {
    readonly _r: 4;
    readonly _val: Result;
    left: Input;
    right: Input;
}
export declare function numAt(v: number | Result): number;
export declare function literalAt(v: number | Result): string | number | boolean | null;
export declare function requireMapEntry<K, V>(map: ReadonlyMap<K, V>, key: K): V;
interface Resolved {
    readonly _r: 1;
    val: Result;
    src: string;
}
interface Residual {
    readonly _r: 2;
    expr: Input;
}
interface XorState {
    readonly _r: 3;
    xorResiduals: Input[];
    xorTrueCount: number;
}
type SlotObject = Resolved | Residual | XorState | DivByZeroMarker;
type ArraySlot = Result[] & {
    readonly _r?: undefined;
};
type Slot = null | undefined | string | number | boolean | ArraySlot | SlotObject | Record<string, unknown>;
export declare function slotSrc(v: Slot): Input;
export declare function interpretSimplify(compiled: CompiledExpression, ctx: Context, strictKeys?: string[] | Set<string>, optionalKeys?: string[] | Set<string>): Input;
export {};
