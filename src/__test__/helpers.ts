import { Evaluable } from '../evaluable'

export const permutation = <T>(values: T[]): [T, T][] => {
  const result: [T, T][] = []
  for (let i = 0, j = 0; j < values.length - 1; ) {
    result.push([values[j], values[i + 1]])
    i++
    if (i === values.length - 1) {
      j++
      i = j
    }
  }
  return result
}

export const undefinedOperand = (): Evaluable => ({
  kind: Symbol(),
  evaluate: () => undefined,
  serialize: () => 'undefined',
  simplify: () => undefined,
  toString: () => 'undefined',
})

export const identityEvaluable = (): Evaluable => ({
  kind: Symbol(),
  evaluate: () => 'expression',
  serialize: () => 'expression',
  simplify: function () {
    return this
  },
  toString: () => 'expression',
})
