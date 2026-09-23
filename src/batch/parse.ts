import Engine from '../index.js'
import { ExpressionInput } from '../parser/index.js'
import { buildDependencyGraph } from './dependency-graph.js'
import { ParsedBatch } from './types.js'

export const parseBatch = (
  engine: Engine,
  expressionsMap: Set<ExpressionInput>
): ParsedBatch => {
  const parsed: ParsedBatch = {
    expressions: new Map(),
    dependencyGraph: new Map(),
    expressionsWithDynamic: new Set(),
  }

  for (const expr of expressionsMap) {
    try {
      parsed.expressions.set(expr, engine.parse(expr))
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid expression') {
        throw new Error(`invalid expression: ${JSON.stringify(expr)}`)
      }
      throw error
    }
  }

  const { graph, dynamicRefs } = buildDependencyGraph(parsed.expressions)

  parsed.dependencyGraph = graph
  parsed.expressionsWithDynamic = dynamicRefs

  return parsed
}
