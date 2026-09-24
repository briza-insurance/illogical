import Engine from '../index.js';
import { ExpressionInput } from '../parser/index.js';
import { ParsedBatch } from './types.js';
/**
 * Parse a batch of expressions and build the corresponding dependency graph.
 *
 * @param engine — The engine instance used to parse expressions
 * @param expressions — Set of expression inputs to be parsed
 * @returns The parsed batch containing evaluables, dependency graph, and
 *   expressions with dynamic references
 */
export declare const parseBatch: (engine: Engine, expressions: Set<ExpressionInput>) => ParsedBatch;
