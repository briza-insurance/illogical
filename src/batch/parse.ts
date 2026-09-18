import Engine from '../index.js'
import { ExpressionInput } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { buildDependencyGraph } from './dependency-graph.js'
import { ParsedBatch } from './types.js'

export const parseBatch = (
  options: Options,
  engine: Engine,
  expressionsMap: Map<string, ExpressionInput>
): ParsedBatch => {
  const parsed: ParsedBatch = {
    expressions: new Map(),
    dependencyGraph: new Map(),
  }

  for (const [name, expr] of expressionsMap) {
    parsed.expressions.set(name, engine.parse(expr))
  }

  parsed.dependencyGraph = buildDependencyGraph(options, expressionsMap)

  return parsed
}
