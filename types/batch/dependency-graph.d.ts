import { Context, Evaluable } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { DependencyGraph } from './types.js';
/**
 * Build a dependency graph from the list of raw expressions.
 */
export declare function buildDependencyGraph(expressions: Map<ExpressionInput, Evaluable>): {
    graph: DependencyGraph;
    dynamicRefs: Set<ExpressionInput>;
};
/**
 * Find all expression names affected by the context diff.
 */
export declare function findAffectedExpressions(currentContext: Context | undefined, newContext: Context, graph: DependencyGraph): Set<ExpressionInput>;
