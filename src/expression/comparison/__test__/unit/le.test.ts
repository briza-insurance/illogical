import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, le } from '../../le'

describe('expression - comparison - less than or equal', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [le(value(0), value(1)), true],
    [le(value(1), value(1)), true],
    [le(value(0.0), value(1.0)), true],
    [le(value(1.0), value(1.0)), true],
    // Falsy
    [le(value(1), value(0)), false],
    [le(value(1.0), value(0.0)), false],
    // Falsy - non-comparable types
    [le(value(0), value('1')), false],
    [le(value(0), value(true)), false],
    [le(value(0), value(false)), false],
    [le(value(0), value(null)), false],
    [le(value(0), undefinedOperand()), false],
    [le(value(0), collection([value(0)])), false],
    [le(value(0), collection([value('0')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [le(value(10), identityEvaluable()), 'self'],
      [le(identityEvaluable(), value(10)), 'self'],
      [le(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [le(value(10), reference('ref')), ['KIND', 10, '$ref']],
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
    it.each([[le(value(10), reference('ref')), '(10 <= {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
