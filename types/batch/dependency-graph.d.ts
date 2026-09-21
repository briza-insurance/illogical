import { Context } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { DependencyGraph } from './types.js';
/**
 * Build a dependency graph from the list of raw expressions.
 */
export declare function buildDependencyGraph(opts: Options, expressions: Map<string, ExpressionInput>): {
    graph: DependencyGraph;
    dynamicRefs: Set<string>;
};
/**
 * Find all expression names affected by the context diff.
 */
export declare function findAffectedExpressions(currentContext: Context | undefined, newContext: Context, graph: DependencyGraph): Set<string>;
