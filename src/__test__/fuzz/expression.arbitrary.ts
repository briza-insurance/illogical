import fc from 'fast-check'

import { ContextValue } from '../../common/evaluable.js'
import type { Context, ExpressionInput, Input } from '../../index.js'
import Engine from '../../index.js'

const engineOOP = new Engine({ evaluator: 'oop' })

const integerArbitrary = fc.integer({ min: -1000, max: 1000 })

const floatArbitrary = fc
  .integer({ min: -1000, max: 100000 })
  .map((n) => n / 100)

const stringArbitrary = fc.stringMatching(/^[a-zA-Z]+$/)
const dateArbitrary = fc.stringMatching(/^[1-2][0-9]{3}-[0-9]{2}-[0-9]{2}$/)

export const primitiveArbitrary = fc.oneof(
  fc.boolean(),
  integerArbitrary,
  floatArbitrary,
  stringArbitrary,
  fc.constant(null)
)

export const referenceArbitrary = fc
  .stringMatching(/^[a-zA-Z0-9]+$/)
  .map((s) => `$${s}`)

const numberStringArbitrary = fc.oneof(
  integerArbitrary,
  floatArbitrary,
  stringArbitrary,
  referenceArbitrary
)

export const arrayNumberStringArbitrary = fc.array(numberStringArbitrary, {
  minLength: 1,
})

const numberArbitrary = fc.oneof(integerArbitrary, floatArbitrary)

/**
 * Add this custom filter in expressions below to identify poor performance on generators below
 */
export const isValidExp = (exp: ExpressionInput) => {
  try {
    engineOOP.parse(exp)
    return true
  } catch {
    console.log('INVALID', JSON.stringify(exp, null, 2))
    return false
  }
}

interface Tree {
  arithmeticExpr: ExpressionInput
  comparisonExpr: ExpressionInput
  containmentExpr: ExpressionInput
  equalityExpr: ExpressionInput
  overlapExpr: ExpressionInput
  prefixSuffixExpr: ExpressionInput
  presenceExpr: ExpressionInput
  comparisonExpressions: ExpressionInput
  nAryLogicalExpr: ExpressionInput
  notExpr: ExpressionInput
  unaryExpr: ExpressionInput
  logicalExpr: ExpressionInput
  condition: ExpressionInput
}

const { condition: inputArbitrary } = fc.letrec<Tree>(
  (tie: fc.LetrecTypedTie<Tree>) => ({
    arithmeticExpr: fc
      .tuple(
        fc.constantFrom('+' as const, '-' as const, '*' as const, '/' as const),
        fc.array(
          fc.oneof(
            { maxDepth: 3, depthIdentifier: 'condition' },
            numberArbitrary,
            referenceArbitrary,
            tie('arithmeticExpr')
          ),
          { minLength: 2, maxLength: 5 }
        )
      )
      .map(([op, args]): ExpressionInput => [op, ...args]),

    comparisonExpr: fc.oneof(
      { maxDepth: 3, depthIdentifier: 'condition' },
      fc
        .tuple(
          fc.constantFrom(
            '>' as const,
            '>=' as const,
            '<' as const,
            '<=' as const
          ),
          fc.oneof(dateArbitrary, referenceArbitrary),
          fc.oneof(dateArbitrary, referenceArbitrary)
        )
        .map(([op, left, right]): ExpressionInput => [op, left, right]),
      fc
        .tuple(
          fc.constantFrom(
            '>' as const,
            '>=' as const,
            '<' as const,
            '<=' as const
          ),
          fc.oneof(numberArbitrary, referenceArbitrary, tie('arithmeticExpr')),
          fc.oneof(numberArbitrary, referenceArbitrary, tie('arithmeticExpr'))
        )
        .map(([op, left, right]): ExpressionInput => [op, left, right])
    ),

    containmentExpr: fc.oneof(
      { maxDepth: 3, depthIdentifier: 'condition' },
      fc
        .tuple(
          fc.constantFrom('IN' as const, 'NOT IN' as const),
          numberStringArbitrary,
          arrayNumberStringArbitrary
        )
        .map(([op, left, right]): ExpressionInput => [op, left, right]),
      fc
        .tuple(
          fc.constantFrom('IN' as const, 'NOT IN' as const),
          arrayNumberStringArbitrary,
          numberStringArbitrary
        )

        .map(([op, left, right]): ExpressionInput => [op, left, right])
    ),

    equalityExpr: fc
      .tuple(
        fc.constantFrom('==' as const, '!=' as const),
        fc.oneof(primitiveArbitrary, tie('arithmeticExpr')),
        fc.oneof(primitiveArbitrary, tie('arithmeticExpr'))
      )

      .map(([op, left, right]): ExpressionInput => [op, left, right]),

    overlapExpr: fc
      .tuple(
        fc.constant('OVERLAP' as const),
        fc.oneof(arrayNumberStringArbitrary, referenceArbitrary),
        fc.oneof(arrayNumberStringArbitrary, referenceArbitrary)
      )

      .map(([op, left, right]): ExpressionInput => [op, left, right]),

    prefixSuffixExpr: fc
      .tuple(
        fc.constantFrom('PREFIX' as const, 'SUFFIX' as const),
        fc.oneof(stringArbitrary, referenceArbitrary),
        fc.oneof(stringArbitrary, referenceArbitrary)
      )

      .map(([op, left, right]): ExpressionInput => [op, left, right]),

    presenceExpr: fc
      .tuple(
        fc.constantFrom('UNDEFINED' as const, 'PRESENT' as const),
        fc.oneof(stringArbitrary, referenceArbitrary)
      )

      .map(([op, arg]): ExpressionInput => [op, arg]),

    comparisonExpressions: fc.oneof<
      [
        fc.Arbitrary<ExpressionInput>,
        fc.Arbitrary<ExpressionInput>,
        fc.Arbitrary<ExpressionInput>,
        fc.Arbitrary<ExpressionInput>,
        fc.Arbitrary<ExpressionInput>,
        fc.Arbitrary<ExpressionInput>,
      ]
    >(
      { maxDepth: 3, depthIdentifier: 'condition' },
      tie('comparisonExpr'),
      tie('containmentExpr'),
      tie('equalityExpr'),
      tie('overlapExpr'),
      tie('prefixSuffixExpr'),
      tie('presenceExpr')
    ),

    nAryLogicalExpr: fc
      .tuple(
        fc.constantFrom(
          'AND' as const,
          'OR' as const,
          'NOR' as const,
          'XOR' as const
        ),
        fc.array(tie('condition'), { minLength: 2, maxLength: 5 })
      )

      .map(([op, args]): ExpressionInput => [op, ...args]),

    notExpr: fc
      .tuple(fc.constant('NOT' as const), tie('condition'))

      .map(([op, arg]): ExpressionInput => [op, arg]),

    unaryExpr: tie('notExpr'),

    logicalExpr: fc.oneof<
      [fc.Arbitrary<ExpressionInput>, fc.Arbitrary<ExpressionInput>]
    >(
      { maxDepth: 3, depthIdentifier: 'condition' },
      tie('nAryLogicalExpr'),
      tie('unaryExpr')
    ),

    condition: fc.oneof<
      [fc.Arbitrary<ExpressionInput>, fc.Arbitrary<ExpressionInput>]
    >(
      { maxDepth: 3, depthIdentifier: 'condition' },
      tie('comparisonExpressions'),
      tie('logicalExpr')
    ),
  })
)

export const expressionArbitrary: fc.Arbitrary<ExpressionInput> = inputArbitrary

export const extractReferences = (expr: ExpressionInput): string[] => {
  const refs = new Set<string>()
  const walk = (node: Input) => {
    if (typeof node === 'string' && node.startsWith('$')) {
      refs.add(node.slice(1))
    } else if (Array.isArray(node)) {
      node.forEach(walk)
    }
  }
  walk(expr)
  return Array.from(refs)
}

export const expressionAndContextArbitrary = expressionArbitrary.chain(
  (expression) => {
    const refs = extractReferences(expression)

    const refArbs = refs.reduce<Record<string, fc.Arbitrary<ContextValue>>>(
      (acc, ref) => {
        acc[ref] = fc.option(
          fc.oneof(primitiveArbitrary, arrayNumberStringArbitrary),
          { nil: undefined }
        )
        return acc
      },
      {}
    )

    return fc.record(refArbs).map((contextBase) => {
      const context: Context = {}
      for (const [key, value] of Object.entries(contextBase)) {
        context[key] = value
      }
      return { expression, context }
    })
  }
)
