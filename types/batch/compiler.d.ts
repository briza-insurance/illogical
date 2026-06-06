/**
 * Batch compiler.
 *
 * Compiles multiple expressions into a single CompiledBatch, reusing
 * emitExpression internals from the single-expression compiler but with
 * shared state across all expressions. This enables:
 * - Ref deduplication across expressions (sharedRefs[])
 * - Const deduplication across expressions (sharedConsts[])
 * - Shared locals pool (each expression gets [base, base+numLocals))
 *
 * DO NOT duplicate emitExpression logic — we reuse the exact same
 * emitExpression implementation from compiler.ts.
 */
import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { CompiledBatch } from './types.js';
/**
 * Compile a map of expressions into a single CompiledBatch.
 *
 * Phase 1: Collect all refs and consts into shared maps, build dependency graph.
 * Phase 2: Compile each expression with shared state, assign localsBase offsets.
 * Phase 3: Build sharedConstSets.
 */
export declare function compileBatch(expressions: Map<string, ExpressionInput>, opts: Options): CompiledBatch;
