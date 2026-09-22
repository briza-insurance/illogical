import { Context, Evaluable } from '../common/evaluable.js';
import { DependencyGraph } from './types.js';
/**
 * Build a dependency graph from the list of raw expressions.
 */
export declare function buildDependencyGraph(expressions: Map<string, Evaluable>): {
    graph: DependencyGraph;
    dynamicRefs: Set<string>;
};
/**
 * Find all expression names affected by the context diff.
 */
export declare function findAffectedExpressions(currentContext: Context | undefined, newContext: Context, graph: DependencyGraph): Set<string>;
