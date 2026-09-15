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
    sumOp: string;
    subtractOp: string;
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
    rootAllowed: Set<string>;
    comparisonOps: Set<string>;
    logicalOps: Set<string>;
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
