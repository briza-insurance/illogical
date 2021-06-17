import {
  identityEvaluable,
  permutation,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, ne } from '../../ne'

describe('expression - comparison - not equal', () => {
  const primitives = [
    value(1),
    value('1'),
    value(true),
    value(false),
    undefinedOperand(),
    value(null),
  ]

  const testCases: [Evaluable, boolean][] = [
    // Truthy - different types - across all permutations
    ...permutation(primitives).map<[Evaluable, boolean]>(([left, right]) => [
      ne(left, right),
      true,
    ]),
    // Falsy cases - type A !== type A
    ...primitives.map<[Evaluable, boolean]>((primitive) => [
      ne(primitive, primitive),
      false,
    ]),
    // Truthy
    [ne(value(1), value(10)), true],
    [ne(value('1'), value('10')), true],
    // Array types, truthy in any case
    [ne(collection([value(1)]), collection([value(1)])), true],
    [ne(collection([value('1')]), collection([value('1')])), true],
    [ne(value(1), collection([value(1)])), true],
    [ne(value('1'), collection([value('1')])), true],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [ne(value(10), identityEvaluable()), 'self'],
      [ne(identityEvaluable(), value(10)), 'self'],
      [ne(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [ne(value(10), reference('ref')), ['KIND', 10, '$ref']],
    ])('%p should be serialized to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'KIND']]),
        })
      ).toEqual(expected)
    })
  })

  describe('toString', () => {
    it.each([[ne(value(10), reference('ref')), '(10 != {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
