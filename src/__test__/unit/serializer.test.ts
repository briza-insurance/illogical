import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine, {
  defaultOptions,
  type ExpressionInput,
  Input,
} from '../../index.js'
import { Options } from '../../parser/options.js'
import { testCases } from '../data/test-cases.js'

for (const mode of ['oop', 'bytecode'] as const) {
  describe('Serialize', () => {
    const engine = new Engine({ evaluator: mode })

    for (const tc of testCases) {
      test(`[${mode}] serializing: ${JSON.stringify(tc.expression)}`, () => {
        const evaluable = engine.parse(tc.expression)

        const serialized = evaluable.serialize(defaultOptions)

        assert.deepStrictEqual(
          JSON.stringify(serialized),
          tc.serializeOverride
            ? JSON.stringify(tc.serializeOverride)
            : JSON.stringify(tc.expression),
          `[${mode}] Expected serialize to return ${JSON.stringify(tc.expression)}, got ${JSON.stringify(serialized)}`
        )
      })
    }
  })
}

const updateRefSymbol = (
  expression: ExpressionInput | Input
): ExpressionInput | Input =>
  Array.isArray(expression)
    ? expression.map((item) => {
        if (typeof item === 'string' && item.startsWith('$')) {
          return '#' + item.slice(1)
        }
        if (Array.isArray(item)) {
          return updateRefSymbol(item)
        }
        return item
      })
    : expression

const referencePredicate = (key: unknown): boolean => {
  return typeof key === 'string' && key[0] === '#'
}

const referenceTransform = (key: string): string => {
  return key.slice(1)
}

const referenceSerialization = (key: string): string => {
  return `#${key}`
}
const isExpressionInput = (
  exp: ExpressionInput | Input
): exp is ExpressionInput => Array.isArray(exp)

for (const mode of ['oop', 'bytecode'] as const) {
  describe('Serialize with custom options', () => {
    const options: Partial<Options> = {
      evaluator: mode,
      referencePredicate,
      referenceTransform,
      referenceSerialization,
    }

    const engine = new Engine(options)

    for (const tc of testCases) {
      const updatedExpression = updateRefSymbol(tc.expression)
      const updatedOverride = tc.serializeOverride
        ? updateRefSymbol(tc.serializeOverride)
        : undefined

      if (!isExpressionInput(updatedExpression)) {
        assert.fail('Unexpected non ExpressionInput')
      }

      test(`[${mode}] serializing: ${JSON.stringify(updatedExpression)}`, () => {
        const evaluable = engine.parse(updatedExpression)

        const serialized = evaluable.serialize({
          ...defaultOptions,
          ...options,
        })

        assert.deepStrictEqual(
          JSON.stringify(serialized),
          updatedOverride
            ? JSON.stringify(updatedOverride)
            : JSON.stringify(updatedExpression),
          `[${mode}] Expected serialize to return ` +
            `${JSON.stringify(updatedExpression)}, got ${JSON.stringify(serialized)}`
        )
      })
    }
  })
}
