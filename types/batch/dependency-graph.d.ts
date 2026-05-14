/**
 * Dependency graph for batch evaluation.
 *
 * Maps context keys to the expressions that reference them.
 * Built during compileBatch Phase 1 from the raw expression inputs
 * and the compiled refs table.
 */
import { CompactRef } from '../bytecode/refs.js';
import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { DependencyGraph } from './types.js';
/**
 * Build a dependency graph from a compiled batch.
 *
 * Uses the compiled refs table to correctly resolve all ref types,
 * not just simple string refs.
 */
export declare function buildDependencyGraph(expressions: Map<string, ExpressionInput>, sharedRefs: CompactRef[], refKeys: string[], opts: Options): DependencyGraph;
/**
 * Find all expression names affected by a set of changed context keys.
 */
export declare function findAffectedExpressions(graph: DependencyGraph, changedKeys: string[]): Set<string>;
