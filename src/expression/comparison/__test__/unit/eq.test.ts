import {
  identityEvaluable,
  permutation,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { eq, KIND } from '../../eq'

describe('expression - comparison - equal', () => {
  const primitives = [
    value(1),
    value('1'),
    value(true),
    value(false),
    undefinedOperand(),
    value(null),
  ]

  const testCases: [Evaluable, boolean][] = [
    // Truthy cases - type A === type A
    ...primitives.map<[Evaluable, boolean]>((primitive) => [
      eq(primitive, primitive),
      true,
    ]),
    // Falsy - different types - across all permutations
    ...permutation(primitives).map<[Evaluable, boolean]>(([left, right]) => [
      eq(left, right),
      false,
    ]),
    // Falsy
    [eq(value(1), value(10)), false],
    [eq(value('1'), value('10')), false],
    // Array types, falsy in any case
    [eq(collection([value(1)]), collection([value(1)])), false],
    [eq(collection([value('1')]), collection([value('1')])), false],
    [eq(value(1), collection([value(1)])), false],
    [eq(value('1'), collection([value('1')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [eq(value(10), identityEvaluable()), 'self'],
      [eq(identityEvaluable(), value(10)), 'self'],
      [eq(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [eq(value(10), reference('ref')), ['KIND', 10, '$ref']],
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
    it.each([[eq(value(10), reference('ref')), '(10 == {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
