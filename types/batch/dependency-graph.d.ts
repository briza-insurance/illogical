import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { DependencyGraph } from './types.js';
/**
 * Build a dependency graph from the list of raw expressions.
 */
export declare function buildDependencyGraph(opts: Options, expressions: Map<string, ExpressionInput>): DependencyGraph;
/**
 * Find all expression names affected by a set of changed context keys.
 */
export declare function findAffectedExpressions(graph: DependencyGraph, changedKeys: string[]): Set<string>;
