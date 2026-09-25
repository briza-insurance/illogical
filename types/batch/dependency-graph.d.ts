import { Context, Evaluable } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { DependencyGraph } from './types.js';
/**
 * Build a dependency graph from the list of raw expressions.
 *
 * @param expressions — Set of expression inputs
 * @param evaluablesMap — WeakMap mapping expression inputs to their evaluable
 *   representations
 * @returns An object containing the dependency graph and the set of expressions
 *   with dynamic references
 */
export declare function buildDependencyGraph(expressions: ExpressionInput[], evaluablesMap: WeakMap<ExpressionInput, Evaluable>): {
    graph: DependencyGraph;
    dynamicRefs: ExpressionInput[];
};
/**
 * Find all expressions affected by the context diff.
 *
 * @param currentContext — The current evaluation context
 * @param newContext — The new evaluation context with potential changes
 * @param graph — The dependency graph mapping context keys to expressions
 * @returns Expression inputs that are affected by the changes in the context
 */
export declare function findAffectedExpressions(currentContext: Context | undefined, newContext: Context, graph: DependencyGraph): ExpressionInput[];
