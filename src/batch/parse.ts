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
    try {
      parsed.expressions.set(name, engine.parse(expr))
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid expression') {
        throw new Error(`invalid expression with name ${name}`)
      }
      throw error
    }
  }

  parsed.dependencyGraph = buildDependencyGraph(options, expressionsMap)

  return parsed
}
