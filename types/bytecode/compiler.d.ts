/**
 * Bytecode compiler.
 *
 * Transforms a raw ExpressionInput (plain array) into a flat Bytecode array
 * that the interpreter can execute. This runs once per unique expression;
 * the result should be cached and reused across evaluate() calls.
 */
import { Result } from '../common/evaluable.js';
import { ArrayInput, ExpressionInput, Input } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { CompactRef } from './refs.js';
export type Bytecode = (number | Result)[];
interface OperatorMaps {
    binary: Record<string, number>;
    arithmetic: Record<string, number>;
    presentOp: string;
    undefinedOp: string;
    andOp: string;
    orOp: string;
    norOp: string;
    notOp: string;
    xorOp: string;
    inOp: string;
    notInOp: string;
    overlapOp: string;
    eqOp: string;
}
export interface CompilerState {
    bytecode: Bytecode;
    refs: CompactRef[];
    refIndex: Map<string, number>;
    refRawKeys: string[];
    refKeys: string[];
    opts: Options;
    maps: OperatorMaps;
    collectionCse: Map<string, number>;
    numLocals: number;
    consts: ArrayInput[];
    constIndex: Map<string, number>;
    overlapRefsEntries: Array<{
        pos: number;
        refIdxs: number[];
    }>;
    directionEntries: Array<{
        pos: number;
        dir: 0 | 1;
    }>;
}
/**
 * Check whether an OR expression matches the pattern:
 *   OR( AND(IN-like(ref1, set1), IN-like(ref2, set2)), ... )
 * where IN-like is either IN(ref, staticSet) or ==(ref, scalar),
 * and every branch uses the exact same two refs in the same order.
 *
 * Builds an inverted index: for each unique value in any setA, union-merges all
 * setB values across branches where that setA value appears, and emits one
 * (literal value, mergedSetBIdx) entry per distinct setA value.
 *
 * This lets the interpreter do a single O(1) Map lookup on ref1 to find all
 * relevant setB indices, instead of a linear scan through N setA Sets.
 * Returns null if the pattern does not match.
 */
export declare function detectOrAndIn2Pattern(arr: ArrayInput, state: CompilerState): {
    ref1Raw: string;
    ref2Raw: string;
    entries: Array<[Result, number]>;
    entryOperators: Array<['eq' | 'in', 'eq' | 'in']>;
} | null;
export interface CompiledExpression {
    bytecode: Bytecode;
    refs: CompactRef[];
    numLocals: number;
    consts: ArrayInput[];
    opNames: Record<number, string>;
    refKeys: string[];
    refRawKeys: string[];
    overlapRefsResiduals: Array<[number, Input[]]>;
    directionMap: Array<[number, 0 | 1]>;
    refFirstCtxKeys: (string | undefined)[];
}
/**
 * Compile a raw ExpressionInput into bytecode.
 * The result should be cached and reused across evaluate() calls.
 */
export declare function compile(raw: ExpressionInput, opts: Options): CompiledExpression;
export {};
