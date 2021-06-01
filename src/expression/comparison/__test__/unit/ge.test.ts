import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { ge, KIND } from '../../ge'

describe('expression - comparison - greater than or equal', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [ge(value(1), value(0)), true],
    [ge(value(1), value(1)), true],
    [ge(value(1.0), value(0.0)), true],
    [ge(value(1.0), value(1.0)), true],
    // Falsy
    [ge(value(0), value(1)), false],
    [ge(value(0.0), value(1.0)), false],
    // Falsy - non-comparable types
    [ge(value(1), value('0')), false],
    [ge(value(1), value(true)), false],
    [ge(value(1), value(false)), false],
    [ge(value(1), value(null)), false],
    [ge(value(1), undefinedOperand()), false],
    [ge(value(1), collection([value(0)])), false],
    [ge(value(1), collection([value('0')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [ge(value(10), identityEvaluable()), 'self'],
      [ge(identityEvaluable(), value(10)), 'self'],
      [ge(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [ge(value(10), reference('ref')), ['KIND', 10, '$ref']],
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
    it.each([[ge(value(10), reference('ref')), '(10 >= {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
